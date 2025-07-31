import request from 'supertest';
import app from '../../app.js';
import { Class } from '../../models/index.js';
import { authenticateToken, authorizeRoles } from '../../middleware/auth.js';

// Mock auth middleware
jest.mock('../../middleware/auth.js', () => ({
  authenticateToken: jest.fn((req, res, next) => next()),
  authorizeRoles: jest.fn((...roles) => (req, res, next) => next())
}));

describe('Class Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /classes', () => {
    it('should create a new class (manager only)', async () => {
      const mockClass = {
        id: 1,
        name: 'Advanced Web Development',
        code: 'AWD-2025',
        trimester: 'Trimester 1',
        intake_period: 'HT1',
        mode: 'hybrid',
        cohort_id: 5
      };

      Class.create = jest.fn().mockResolvedValue(mockClass);

      const response = await request(app)
        .post('/classes')
        .send({
          name: 'Advanced Web Development',
          code: 'AWD-2025',
          trimester: 'Trimester 1',
          intake_period: 'HT1',
          mode: 'hybrid',
          cohort_id: 5
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Advanced Web Development');
      expect(Class.create).toHaveBeenCalled();
      expect(authorizeRoles).toHaveBeenCalledWith(['manager']);
    });

    it('should return 400 for invalid class data', async () => {
      const response = await request(app)
        .post('/classes')
        .send({
          // Missing required fields
          name: 'Invalid Class'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /classes', () => {
    it('should return all classes with pagination', async () => {
      const mockClasses = [
        { id: 1, name: 'Class 1' },
        { id: 2, name: 'Class 2' }
      ];

      Class.findAndCountAll = jest.fn().mockResolvedValue({
        count: 2,
        rows: mockClasses
      });

      const response = await request(app)
        .get('/classes')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(Class.findAndCountAll).toHaveBeenCalled();
    });

    it('should filter classes by cohort_id', async () => {
      const mockClass = { id: 1, name: 'Class 1', cohort_id: 5 };

      Class.findAndCountAll = jest.fn().mockResolvedValue({
        count: 1,
        rows: [mockClass]
      });

      const response = await request(app)
        .get('/classes')
        .query({ cohort_id: 5 });

      expect(response.status).toBe(200);
      expect(response.body.data[0].cohort_id).toBe(5);
    });
  });

  describe('GET /classes/:id', () => {
    it('should return a class by ID', async () => {
      const mockClass = {
        id: 1,
        name: 'Advanced Web Development',
        cohort: { id: 5, name: '2025 Spring Cohort' }
      };

      Class.findByPk = jest.fn().mockResolvedValue(mockClass);

      const response = await request(app).get('/classes/1');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Advanced Web Development');
      expect(Class.findByPk).toHaveBeenCalledWith(1, {
        include: expect.anything()
      });
    });

    it('should return 404 if class not found', async () => {
      Class.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app).get('/classes/999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /classes/:id', () => {
    it('should update a class (manager only)', async () => {
      const mockClass = {
        id: 1,
        name: 'Old Name',
        update: jest.fn().mockResolvedValue({
          id: 1,
          name: 'New Name'
        })
      };

      Class.findByPk = jest.fn().mockResolvedValue(mockClass);

      const response = await request(app)
        .put('/classes/1')
        .send({
          name: 'New Name'
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('New Name');
      expect(mockClass.update).toHaveBeenCalled();
      expect(authorizeRoles).toHaveBeenCalledWith(['manager']);
    });

    it('should return 404 if class to update not found', async () => {
      Class.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put('/classes/999')
        .send({
          name: 'New Name'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /classes/:id', () => {
    it('should delete a class (manager only)', async () => {
      const mockClass = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true)
      };

      Class.findByPk = jest.fn().mockResolvedValue(mockClass);

      const response = await request(app).delete('/classes/1');

      expect(response.status).toBe(204);
      expect(mockClass.destroy).toHaveBeenCalled();
      expect(authorizeRoles).toHaveBeenCalledWith(['manager']);
    });

    it('should return 404 if class to delete not found', async () => {
      Class.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app).delete('/classes/999');

      expect(response.status).toBe(404);
    });
  });
});