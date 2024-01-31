import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class OrderProduct extends Model {
  public orderId!: number;
  public productId!: number;
  public quantity!: number;
}

OrderProduct.init({
  orderId: {
    type: DataTypes.INTEGER,
    references: { model: 'Orders', key: 'id' },
    onDelete: 'CASCADE',
  },
  productId: {
    type: DataTypes.INTEGER,
    references: { model: 'Products', key: 'id' },
    onDelete: 'CASCADE',
  },
  quantity: DataTypes.INTEGER,
}, { sequelize, modelName: 'orderProduct', tableName: 'orderProduct', timestamps: false });

export default OrderProduct;
