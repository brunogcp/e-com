'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      name: 'Admin',
      email: 'admin@ecom.com',
      password: '$2b$10$dlirR4GDaBTra/RDlZDM/Occ8/dcS4uS5PWFlCKliuYHLtXueIUcK', // admin
      admin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
