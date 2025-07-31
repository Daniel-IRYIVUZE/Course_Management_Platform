'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('classes', [
      {
        name: '2024S',
        description: 'Spring 2024 class',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: '2024J',
        description: 'January 2024 class',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: '2023F',
        description: 'Fall 2023 class',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('classes', null, {});
  }
};