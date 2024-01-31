import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../config/database';
import Product from './Product';
import User from './User';
import OrderProduct from './OrderProduct';

interface OrderAttributes {
  id?: number;
  userId: number;
  total: number;
  status: string;
}

interface OrderInstance extends Model<OrderAttributes>, OrderAttributes {
  addProduct: (product: Product, options?: any) => Promise<void>;
}

class Order extends Model<OrderAttributes> implements OrderAttributes {
  declare id: number;
  declare userId: number;
  declare total: number;
  declare status: string;

  // Associações
  public readonly user?: User;
  public readonly products?: Product[];

  public static associations: {
    user: Association<Order, User>;
    products: Association<Order, Product>;
  };
}

Order.init({
  userId: {
    type: DataTypes.INTEGER,
    references: { model: 'Users', key: 'id' },
    onDelete: 'CASCADE',
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { sequelize, modelName: 'order', tableName: 'orders' });

Order.belongsTo(User, { foreignKey: 'userId' });
Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });

export default Order as typeof Order & {
  new (): OrderInstance;
};
