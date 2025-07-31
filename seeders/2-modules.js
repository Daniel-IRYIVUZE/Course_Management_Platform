'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('modules', [
      {
        code: 'CS101',
        name: 'Introduction to Computer Science',
        description: 'Basic concepts of computer science',
        credits: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CS102',
        name: 'Data Structures and Algorithms',
        description: 'Fundamental data structures and algorithms',
        credits: 4,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CS201',
        name: 'Database Systems',
        description: 'Introduction to database design and implementation',
        credits: 4,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CS301',
        name: 'Web Development',
        description: 'Modern web development technologies',
        credits: 4,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('modules', null, {});
  }
};