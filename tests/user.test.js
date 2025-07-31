const { User } = require('../models');
const sequelize = require('../config/database');

describe('User Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('should create a new user with hashed password', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: 'facilitator'
    };

    const user = await User.create(userData);
    
    expect(user.id).toBeDefined();
    expect(user.firstName).toBe(userData.firstName);
    expect(user.lastName).toBe(userData.lastName);
    expect(user.email).toBe(userData.email);
    expect(user.role).toBe(userData.role);
    expect(user.password).not.toBe(userData.password);
    expect(user.password.length).toBeGreaterThan(0);
  });

  test('should compare passwords correctly', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test2@example.com',
      password: 'password123',
      role: 'facilitator'
    };

    const user = await User.create(userData);
    
    const isMatch = await user.comparePassword('password123');
    expect(isMatch).toBe(true);

    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });

  test('should require email, firstName, lastName, password, and role', async () => {
    await expect(User.create({})).rejects.toThrow();
  });

  test('should enforce unique email constraint', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'unique@example.com',
      password: 'password123',
      role: 'facilitator'
    };

    await User.create(userData);
    await expect(User.create(userData)).rejects.toThrow();
  });
});