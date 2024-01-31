import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
  admin: boolean;
}

class User extends Model<UserAttributes> implements UserAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare admin: boolean;
}

User.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      name: 'users_email_unique',
      msg: 'O email fornecido já está em uso.'
    },
    validate: {
      isEmail: {
        msg: 'Por favor, forneça um endereço de email válido.'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, { sequelize, modelName: 'user', tableName: 'users' });

export default User;
