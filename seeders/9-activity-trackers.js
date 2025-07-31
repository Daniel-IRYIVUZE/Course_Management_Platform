'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('activity_trackers', [
      {
        course_offering_id: 1,
        week_number: 1,
        attendance: JSON.stringify([true, true, false, true, true]),
        formative_one_grading: 'Done',
        formative_two_grading: 'Not Started',
        summative_grading: 'Not Started',
        course_moderation: 'Pending',
        intranet_sync: 'Done',
        grade_book_status: 'Done',
        comments: 'Good attendance this week',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        course_offering_id: 1,
        week_number: 2,
        attendance: JSON.stringify([true, true, true, true, true]),
        formative_one_grading: 'Done',
        formative_two_grading: 'Pending',
        summative_grading: 'Not Started',
        course_moderation: 'Pending',
        intranet_sync: 'Done',
        grade_book_status: 'Done',
        comments: 'Perfect attendance',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        course_offering_id: 3,
        week_number: 1,
        attendance: JSON.stringify([false, true, true, true, false]),
        formative_one_grading: 'Pending',
        formative_two_grading: 'Not Started',
        summative_grading: 'Not Started',
        course_moderation: 'Not Started',
        intranet_sync: 'Pending',
        grade_book_status: 'Pending',
        comments: 'Need to follow up with absent students',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('activity_trackers', null, {});
  }
};