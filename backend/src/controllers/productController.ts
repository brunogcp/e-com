import { Request, Response } from 'express';
import Product from '../models/Product';

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, imageUrl } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Nome é obrigatório' });  
    }

    if (!price) {
      return res.status(400).json({ message: 'Preço é obrigatório' });  
    }

    const newProduct = await Product.create({ name, description, price, imageUrl });
    return res.status(201).json(newProduct);
  } catch (error: unknown) {
    return res.status(500).json({ message: 'Erro ao adicionar produto', error: error instanceof Error ? error.message : '' });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error: unknown) {
    res.status(500).json({ message: 'Erro ao listar produtos', error: error instanceof Error ? error.message : '' });
  }
};


export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error: unknown) {
    res.status(500).json({ message: 'Erro ao buscar produto', error: error instanceof Error ? error.message : '' });
  }
};


export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Nome é obrigatório' });  
    }

    if (!price) {
      return res.status(400).json({ message: 'Preço é obrigatório' });  
    }

    const product = await Product.findByPk(id);
    if (product) {
      const updatedProduct = await product.update({ name, description, price, imageUrl });
      return res.json(updatedProduct);
    } else {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error: unknown) {
    return res.status(500).json({ message: 'Erro ao atualizar produto', error: error instanceof Error ? error.message : '' });
  }
};


export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error: unknown) {
    res.status(500).json({ message: 'Erro ao deletar produto', error: error instanceof Error ? error.message : '' });
  }
};
