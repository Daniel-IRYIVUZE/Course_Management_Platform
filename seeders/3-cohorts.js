'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('cohorts', [
      {
        name: '2023A',
        start_date: '2023-01-15',
        end_date: '2023-12-15',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: '2023B',
        start_date: '2023-06-15',
        end_date: '2024-05-15',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: '2024A',
        start_date: '2024-01-15',
        end_date: '2024-12-15',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('cohorts', null, {});
  }
};