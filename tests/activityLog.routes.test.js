import request from 'supertest';
import app from '../../app.js'; // Your Express app
import { ActivityLog } from '../../models/index.js';
import { authenticateToken } from '../../middleware/auth.js';

// Mock the auth middleware to bypass actual JWT verification
jest.mock('../../middleware/auth.js', () => ({
  authenticateToken: jest.fn((req, res, next) => next())
}));

describe('Activity Log Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /activity-logs', () => {
    it('should create a new activity log', async () => {
      const mockLog = {
        id: 1,
        week_number: 5,
        attendance: [],
        formative_one_grading: 'Not Started',
        formative_two_grading: 'Not Started',
        summative_grading: 'Not Started',
        course_moderation: 'Not Started',
        intranet_sync: 'Not Started',
        gradebook_status: 'Not Started',
        notes: null,
        created_at: new Date(),
        updated_at: new Date()
      };

      ActivityLog.create = jest.fn().mockResolvedValue(mockLog);

      const response = await request(app)
        .post('/activity-logs')
        .send({
          week_number: 5
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        week_number: 5,
        formative_one_grading: 'Not Started'
      });
      expect(ActivityLog.create).toHaveBeenCalled();
    });

    it('should return 400 for invalid week number', async () => {
      const response = await request(app)
        .post('/activity-logs')
        .send({
          week_number: 53 // Invalid week number
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /activity-logs', () => {
    it('should return all activity logs', async () => {
      const mockLogs = [
        { id: 1, week_number: 5 },
        { id: 2, week_number: 6 }
      ];

      ActivityLog.findAll = jest.fn().mockResolvedValue(mockLogs);

      const response = await request(app).get('/activity-logs');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(ActivityLog.findAll).toHaveBeenCalled();
    });

    it('should filter by week number when query param provided', async () => {
      const mockLog = { id: 1, week_number: 5 };

      ActivityLog.findAll = jest.fn().mockResolvedValue([mockLog]);

      const response = await request(app)
        .get('/activity-logs')
        .query({ week_number: 5 });

      expect(response.status).toBe(200);
      expect(response.body[0].week_number).toBe(5);
      expect(ActivityLog.findAll).toHaveBeenCalledWith({
        where: { week_number: 5 }
      });
    });
  });

  describe('GET /activity-logs/:id', () => {
    it('should return an activity log by ID', async () => {
      const mockLog = {
        id: 1,
        week_number: 5
      };

      ActivityLog.findByPk = jest.fn().mockResolvedValue(mockLog);

      const response = await request(app).get('/activity-logs/1');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(ActivityLog.findByPk).toHaveBeenCalledWith(1);
    });

    it('should return 404 if log not found', async () => {
      ActivityLog.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app).get('/activity-logs/999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /activity-logs/:id', () => {
    it('should update an activity log', async () => {
      const mockLog = {
        id: 1,
        week_number: 5,
        update: jest.fn().mockResolvedValue({
          id: 1,
          week_number: 5,
          notes: 'Updated notes'
        })
      };

      ActivityLog.findByPk = jest.fn().mockResolvedValue(mockLog);

      const response = await request(app)
        .put('/activity-logs/1')
        .send({
          notes: 'Updated notes'
        });

      expect(response.status).toBe(200);
      expect(response.body.notes).toBe('Updated notes');
      expect(mockLog.update).toHaveBeenCalled();
    });

    it('should return 404 if log to update not found', async () => {
      ActivityLog.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put('/activity-logs/999')
        .send({
          notes: 'Updated notes'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /activity-logs/:id', () => {
    it('should delete an activity log', async () => {
      const mockLog = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true)
      };

      ActivityLog.findByPk = jest.fn().mockResolvedValue(mockLog);

      const response = await request(app).delete('/activity-logs/1');

      expect(response.status).toBe(204);
      expect(mockLog.destroy).toHaveBeenCalled();
    });

    it('should return 404 if log to delete not found', async () => {
      ActivityLog.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app).delete('/activity-logs/999');

      expect(response.status).toBe(404);
    });
  });
});