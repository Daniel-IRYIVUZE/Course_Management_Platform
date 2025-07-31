import request from 'supertest';
import app from '../../app.js';
import { User } from '../../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../models/index.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register/student', () => {
    it('should register a new student', async () => {
      const mockStudent = {
        id: 1,
        username: 'student1',
        email: 'student@example.com',
        role: 'student',
        student_id: 'S12345'
      };

      User.create = jest.fn().mockResolvedValue(mockStudent);
      bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');

      const response = await request(app)
        .post('/auth/register/student')
        .send({
          username: 'student1',
          email: 'student@example.com',
          password: 'password123',
          first_name: 'John',
          last_name: 'Doe',
          student_id: 'S12345'
        });

      expect(response.status).toBe(201);
      expect(response.body.username).toBe('student1');
      expect(response.body.role).toBe('student');
      expect(User.create).toHaveBeenCalled();
    });

    it('should return 400 for invalid student data', async () => {
      const response = await request(app)
        .post('/auth/register/student')
        .send({
          // Missing required fields
          username: 'student1'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/register/facilitator', () => {
    it('should register a new facilitator', async () => {
      const mockFacilitator = {
        id: 2,
        username: 'facilitator1',
        email: 'facilitator@example.com',
        role: 'facilitator',
        faculty_position: 'Lecturer'
      };

      User.create = jest.fn().mockResolvedValue(mockFacilitator);
      bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');

      const response = await request(app)
        .post('/auth/register/facilitator')
        .send({
          username: 'facilitator1',
          email: 'facilitator@example.com',
          password: 'password123',
          first_name: 'Jane',
          last_name: 'Smith',
          faculty_position: 'Lecturer'
        });

      expect(response.status).toBe(201);
      expect(response.body.role).toBe('facilitator');
    });
  });

  describe('POST /auth/register/manager', () => {
    it('should register a new manager', async () => {
      const mockManager = {
        id: 3,
        username: 'manager1',
        email: 'manager@example.com',
        role: 'manager',
        department: 'IT'
      };

      User.create = jest.fn().mockResolvedValue(mockManager);
      bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');

      const response = await request(app)
        .post('/auth/register/manager')
        .send({
          username: 'manager1',
          email: 'manager@example.com',
          password: 'password123',
          first_name: 'Admin',
          last_name: 'User',
          department: 'IT'
        });

      expect(response.status).toBe(201);
      expect(response.body.role).toBe('manager');
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user with valid credentials', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        role: 'student',
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);
      jwt.sign = jest.fn().mockReturnValue('fake.jwt.token');

      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBe('fake.jwt.token');
      expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
    });

    it('should return 401 for invalid credentials', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'nonexistent',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /auth/me', () => {
    it('should return current user profile', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'student'
      };

      // Mock the authenticateToken middleware to set req.user
      authenticateToken.mockImplementation((req, res, next) => {
        req.user = mockUser;
        next();
      });

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer fake.jwt.token');

      expect(response.status).toBe(200);
      expect(response.body.username).toBe('testuser');
    });

    it('should return 401 without token', async () => {
      authenticateToken.mockImplementation((req, res) => {
        res.sendStatus(401);
      });

      const response = await request(app).get('/auth/me');

      expect(response.status).toBe(401);
    });
  });
});