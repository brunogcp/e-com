import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface ProductAttributes {
  id?: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

class Product extends Model<ProductAttributes>
  implements ProductAttributes {
  declare id: number;
  declare name: string;
  declare description: string;
  declare price: number;
  declare imageUrl: string;
}

Product.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
}, { sequelize, modelName: 'product', tableName: 'products' });

export default Product;
