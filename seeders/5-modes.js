'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('modes', [
      {
        name: 'Online',
        description: 'Online delivery mode',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'In-person',
        description: 'Face-to-face delivery mode',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hybrid',
        description: 'Combination of online and in-person',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('modes', null, {});
  }
};