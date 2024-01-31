'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orderProduct', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderId: {
        type: Sequelize.INTEGER,
        references: { model: 'orders', key: 'id' },
        onDelete: 'CASCADE',
      },
      productId: {
        type: Sequelize.INTEGER,
        references: { model: 'products', key: 'id' },
        onDelete: 'CASCADE',
      },
      quantity: Sequelize.INTEGER,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orderProduct');
  }
};
