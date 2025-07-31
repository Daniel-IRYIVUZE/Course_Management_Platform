const { Module } = require('../models');
const sequelize = require('../config/database');

describe('Module Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('should create a new module', async () => {
    const moduleData = {
      code: 'CS101',
      name: 'Introduction to Computer Science',
      description: 'Basic concepts of computer science',
      credits: 3
    };

    const module = await Module.create(moduleData);
    
    expect(module.id).toBeDefined();
    expect(module.code).toBe(moduleData.code);
    expect(module.name).toBe(moduleData.name);
    expect(module.description).toBe(moduleData.description);
    expect(module.credits).toBe(moduleData.credits);
    expect(module.isActive).toBe(true);
  });

  test('should require code and name', async () => {
    await expect(Module.create({})).rejects.toThrow();
  });

  test('should enforce unique code constraint', async () => {
    const moduleData = {
      code: 'CS102',
      name: 'Unique Module',
      credits: 3
    };

    await Module.create(moduleData);
    await expect(Module.create(moduleData)).rejects.toThrow();
  });
});