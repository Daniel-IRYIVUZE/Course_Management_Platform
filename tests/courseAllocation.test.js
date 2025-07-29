// tests/courseAllocation.test.js
const request = require('supertest');
const app = require('../app');
const User = require('../models').User;
const CourseOffering = require('../models').CourseOffering;
const Module = require('../models').Module;
const Facilitator = require('../models').Facilitator;

describe('Course Allocation Controller', () => {
  let managerToken;
  let facilitatorToken;
  
  beforeAll(async () => {
    // Create test users
    await User.destroy({ where: {}, truncate: true });
    
    // Create manager
    const managerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Manager',
        email: 'manager@example.com',
        password: 'password123',
        role: 'manager'
      });
    managerToken = managerRes.body.token;
    
    // Create facilitator
    const facilitatorRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Facilitator',
        email: 'facilitator@example.com',
        password: 'password123',
        role: 'facilitator'
      });
    facilitatorToken = facilitatorRes.body.token;
    
    // Create test data
    const module = await Module.create({ code: 'CS101', name: 'Computer Science 101' });
    const facilitator = await Facilitator.create({ userId: 2 }); // facilitator user is id 2
    
    await CourseOffering.create({
      moduleId: module.id,
      classId: 1,
      facilitatorId: facilitator.id,
      modeId: 1,
      trimester: '2023T1',
      cohort: '2023',
      intake: 'FT'
    });
  });

  describe('GET /api/course-offerings', () => {
    it('should get all course offerings for manager', async () => {
      const res = await request(app)
        .get('/api/course-offerings')
        .set('Authorization', `Bearer ${managerToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should get only assigned courses for facilitator', async () => {
      const res = await request(app)
        .get('/api/course-offerings')
        .set('Authorization', `Bearer ${facilitatorToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
    });
  });

  describe('POST /api/course-offerings', () => {
    it('should create a new course offering (manager only)', async () => {
      const res = await request(app)
        .post('/api/course-offerings')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          moduleId: 1,
          classId: 1,
          facilitatorId: 1,
          modeId: 1,
          trimester: '2023T2',
          cohort: '2023',
          intake: 'HT1'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
    });

    it('should forbid creation by non-manager', async () => {
      const res = await request(app)
        .post('/api/course-offerings')
        .set('Authorization', `Bearer ${facilitatorToken}`)
        .send({
          moduleId: 1,
          classId: 1,
          facilitatorId: 1,
          modeId: 1,
          trimester: '2023T2',
          cohort: '2023',
          intake: 'HT1'
        });
      
      expect(res.statusCode).toEqual(403);
    });
  });
});