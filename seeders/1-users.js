'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@zandacollege.edu.rw',
        password: '$2a$10$X8zZ2JZJZJZJZJZJZJZJZ.JZJZJZJZJZJZJZJZJZJZJZJZJZJZJZ', // password123
        role: 'manager',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@zandacollege.edu.rw',
        password: '$2a$10$X8zZ2JZJZJZJZJZJZJZJZ.JZJZJZJZJZJZJZJZJZJZJZJZJZJZJZ', // password123
        role: 'facilitator',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@zandacollege.edu.rw',
        password: '$2a$10$X8zZ2JZJZJZJZJZJZJZJZ.JZJZJZJZJZJZJZJZJZJZJZJZJZJZJZ', // password123
        role: 'facilitator',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Student',
        last_name: 'One',
        email: 'student1@zandacollege.edu.rw',
        password: '$2a$10$X8zZ2JZJZJZJZJZJZJZJZ.JZJZJZJZJZJZJZJZJZJZJZJZJZJZJZ', // password123
        role: 'student',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};