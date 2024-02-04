import { Request, Response } from 'express';
import sequelize from '../config/database';
import Order, { OrderAttributes } from '../models/Order';
import Product from '../models/Product';
import { WhereOptions } from 'sequelize';
import { publishOrderNotification } from '../amqp/publishOrderNotification';
import { Status } from '../types/status';

export const createOrder = async (req: Request, res: Response) => {
  const { products } : {products: {productId: number, quantity: number}[]} = req.body; // `products` deve ser um array de { productId, quantity }

  if (!req.user?.id) {
    return res.status(400).json({ message: 'Usuário não encontrado' });
  }

  if (!products?.length) {
    return res.status(400).json({ message: 'Deve incluir pelo menos um produto para criar a ordem' });
  }

  const t = await sequelize.transaction();

  try {
    const userId = parseInt(req.user?.id)
    const status: Status = 'pending'
    const email = req.user?.email
    const newOrder = await Order.create({ 
      userId, 
      status,
      total: 0 // Inicialmente 0, calcularemos baseado nos produtos
    }, { transaction: t });

    let total = 0;

    for (const { productId, quantity } of products) {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error(`Produto com ID ${productId} não encontrado`);
      }
      if (!quantity) {
        throw new Error(`Quantidade do produto com ID ${productId} deve ser maior que zero`);
      }
      await newOrder.addProduct(product, { 
        through: { quantity },
        transaction: t
      });
      total += product.get({ plain: true }).price * quantity;
    }

    await newOrder.update({ total }, { transaction: t });
    const order = await Order.findByPk(newOrder.dataValues.id, { include: Product , transaction: t });
    await publishOrderNotification({
      orderId: order.dataValues.id || 0,
      userId,
      email,
      status,
      products: order.dataValues.products.map((product) => product.get({ plain: true }))
    });

    await t.commit();

    return res.status(201).json({...newOrder, message: 'Pedido Criado!'});
  } catch (error: unknown) {
    await t.rollback();
    return res.status(500).json({ message: 'Erro ao criar pedido', error: error instanceof Error ? error.message : '' });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const {search} = req.query

    let where: WhereOptions<OrderAttributes> = {}
    if (search === 'my') {
      where = {
        userId: req.user?.id
      }
    }

    const orders = await Order.findAll({ where, include: [ { model: Product } ] });
    res.json(orders);
  } catch (error: unknown) {
    res.status(500).json({ message: 'Erro ao listar Pedidos', error: error instanceof Error ? error.message : '' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, { include: [ { model: Product } ] });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Pedido não encontrado' });
    }
  } catch (error: unknown) {
    res.status(500).json({ message: 'Erro ao buscar Pedido', error: error instanceof Error ? error.message : '' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!req.user?.id) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    if (!status) {
      return res.status(400).json({ message: 'Status é obrigatório' });  
    }

    if (!['pending', 'confirmed', 'canceled', 'sent', 'delivered'].find((value) => value === status)) {
      return res.status(400).json({ message: 'Status não é válido' });  
    }

    const order = await Order.findByPk(id, { include: Product , transaction: t });
    if (order) {
      const updatedOrder = await order.update({ status }, { transaction: t });
      
      const userId = parseInt(req.user?.id);
      const email = req.user?.email;

      await publishOrderNotification({
        orderId: updatedOrder.dataValues.id || 0,
        userId,
        email,
        status,
        products: updatedOrder.dataValues.products.map((product) => product.get({ plain: true }))
      });

      await t.commit(); 
      return res.json({...updatedOrder.get({ plain: true }), message: 'Pedido Atualizada!'});
    } else {
      await t.rollback();
      return res.status(404).json({ message: 'Pedido não encontrada' });
    }
  } catch (error: unknown) {
    await t.rollback();
    return res.status(500).json({ message: 'Erro ao atualizar Pedido', error: error instanceof Error ? error.message : '' });
  }
};

