'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('course_offerings', [
      {
        module_id: 1,
        cohort_id: 1,
        class_id: 1,
        trimester_id: 3,
        intake_id: 1,
        mode_id: 2,
        facilitator_id: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_id: 2,
        cohort_id: 1,
        class_id: 1,
        trimester_id: 3,
        intake_id: 1,
        mode_id: 2,
        facilitator_id: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_id: 3,
        cohort_id: 2,
        class_id: 2,
        trimester_id: 3,
        intake_id: 2,
        mode_id: 1,
        facilitator_id: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_id: 4,
        cohort_id: 2,
        class_id: 2,
        trimester_id: 3,
        intake_id: 2,
        mode_id: 1,
        facilitator_id: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('course_offerings', null, {});
  }
};