'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('trimesters', [
      {
        name: 'Trimester 1 2023',
        start_date: '2023-01-15',
        end_date: '2023-04-15',
        is_current: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Trimester 2 2023',
        start_date: '2023-05-15',
        end_date: '2023-08-15',
        is_current: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Trimester 3 2023',
        start_date: '2023-09-15',
        end_date: '2023-12-15',
        is_current: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('trimesters', null, {});
  }
};