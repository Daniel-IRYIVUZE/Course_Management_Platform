import request from 'supertest';
import app from '../../app.js';
import { Cohort } from '../../models/index.js';
import { authenticateToken } from '../../middleware/auth.js';

// Mock auth middleware
jest.mock('../../middleware/auth.js', () => ({
  authenticateToken: jest.fn((req, res, next) => next())
}));

describe('Cohort Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /cohorts', () => {
    it('should create a new cohort', async () => {
      const mockCohort = {
        id: 1,
        name: '2025-FALL-WEB-DEV',
        start_date: '2025-09-01',
        end_date: '2025-12-15',
        status: 'planned'
      };

      Cohort.create = jest.fn().mockResolvedValue(mockCohort);

      const response = await request(app)
        .post('/cohorts')
        .send({
          name: '2025-FALL-WEB-DEV',
          start_date: '2025-09-01',
          end_date: '2025-12-15',
          status: 'planned'
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('2025-FALL-WEB-DEV');
      expect(Cohort.create).toHaveBeenCalled();
    });

    it('should return 400 for invalid cohort data', async () => {
      const response = await request(app)
        .post('/cohorts')
        .send({
          // Missing required fields
          name: 'Invalid Cohort'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /cohorts', () => {
    it('should return all cohorts', async () => {
      const mockCohorts = [
        { id: 1, name: 'Cohort 1' },
        { id: 2, name: 'Cohort 2' }
      ];

      Cohort.findAll = jest.fn().mockResolvedValue(mockCohorts);

      const response = await request(app).get('/cohorts');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(Cohort.findAll).toHaveBeenCalled();
    });
  });

  describe('GET /cohorts/:id', () => {
    it('should return a cohort by ID', async () => {
      const mockCohort = {
        id: 1,
        name: '2025-FALL-WEB-DEV'
      };

      Cohort.findByPk = jest.fn().mockResolvedValue(mockCohort);

      const response = await request(app).get('/cohorts/1');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('2025-FALL-WEB-DEV');
      expect(Cohort.findByPk).toHaveBeenCalledWith(1);
    });

    it('should return 404 if cohort not found', async () => {
      Cohort.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app).get('/cohorts/999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /cohorts/:id', () => {
    it('should update a cohort', async () => {
      const mockCohort = {
        id: 1,
        name: 'Old Name',
        update: jest.fn().mockResolvedValue({
          id: 1,
          name: 'New Name'
        })
      };

      Cohort.findByPk = jest.fn().mockResolvedValue(mockCohort);

      const response = await request(app)
        .put('/cohorts/1')
        .send({
          name: 'New Name'
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('New Name');
      expect(mockCohort.update).toHaveBeenCalled();
    });

    it('should return 404 if cohort to update not found', async () => {
      Cohort.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put('/cohorts/999')
        .send({
          name: 'New Name'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /cohorts/:id', () => {
    it('should delete a cohort', async () => {
      const mockCohort = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true)
      };

      Cohort.findByPk = jest.fn().mockResolvedValue(mockCohort);

      const response = await request(app).delete('/cohorts/1');

      expect(response.status).toBe(204);
      expect(mockCohort.destroy).toHaveBeenCalled();
    });

    it('should return 404 if cohort to delete not found', async () => {
      Cohort.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app).delete('/cohorts/999');

      expect(response.status).toBe(404);
    });
  });
});