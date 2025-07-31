'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('intakes', [
      {
        name: 'HT1',
        description: 'Half Term 1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'HT2',
        description: 'Half Term 2',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'FT',
        description: 'Full Term',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('intakes', null, {});
  }
};