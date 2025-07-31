import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import express from 'express';

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import setupMiddleware from './middleware/config.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import cohortRoutes from './routes/cohort.routes.js';
import classRoutes from './routes/class.routes.js';
import moduleRoutes from './routes/module.routes.js';
import swaggerTags from './swagger/swagger.tags.js';
import courseOfferingRoutes from './routes/courseOffering.routes.js';
import activityLogRoutes from './routes/activityLog.routes.js';
import gradeRoutes from './routes/grade.routes.js';

import DeadlineChecker from './services/deadlineChecker.js';
import notificationWorker from './workers/notificationWorker.js';

// Start the deadline checker cron jobs
DeadlineChecker.startCronJobs();

// Start the notification worker if it's a function
if (typeof notificationWorker === 'function') {
  notificationWorker();
}

const app = express();

// Apply middleware
setupMiddleware(app);

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Course Management API',
      version: '1.0.0',
      description: 'API for managing courses, users, and activities in Rwandan academic institutions',
      contact: {
        email: 'info@rwandanuniversity.ac.rw',
      },
    },
    tags: swaggerTags,
    components: {
      schemas: {
        UserBase: {
          type: 'object',
          required: ['username', 'email', 'password', 'first_name', 'last_name'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 250,
              example: 'mugisha_jean',
            },
            email: {
              type: 'string',
              format: 'email',
              maxLength: 100,
              example: 'mugisha.jean@unr.rw',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              example: 'securePassword123',
            },
            first_name: {
              type: 'string',
              maxLength: 250,
              example: 'Jean',
            },
            last_name: {
              type: 'string',
              maxLength: 250,
              example: 'Mugisha',
            },
          },
        },
        StudentInput: {
          allOf: [
            { $ref: '#/components/schemas/UserBase' },
            {
              type: 'object',
              required: ['student_id'],
              properties: {
                student_id: {
                  type: 'string',
                  maxLength: 50,
                  example: 'STU20250001',
                },
              },
            },
          ],
        },
        FacilitatorInput: {
          allOf: [
            { $ref: '#/components/schemas/UserBase' },
            {
              type: 'object',
              properties: {
                faculty_position: {
                  type: 'string',
                  maxLength: 250,
                  example: 'Lecturer',
                },
                specialization: {
                  type: 'string',
                  maxLength: 200,
                  example: 'Agricultural Engineering',
                },
              },
            },
          ],
        },
        ManagerInput: {
          allOf: [
            { $ref: '#/components/schemas/UserBase' },
            {
              type: 'object',
              properties: {
                department: {
                  type: 'string',
                  maxLength: 100,
                  example: 'Faculty of Science and Technology',
                },
              },
            },
          ],
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            username: {
              type: 'string',
              example: 'mugisha_jean',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'mugisha.jean@unr.rw',
            },
            role: {
              type: 'string',
              enum: ['manager', 'facilitator', 'student'],
              example: 'student',
            },
            first_name: {
              type: 'string',
              example: 'Jean',
            },
            last_name: {
              type: 'string',
              example: 'Mugisha',
            },
            student_id: {
              type: 'string',
              nullable: true,
              example: 'STU20250001',
            },
            faculty_position: {
              type: 'string',
              nullable: true,
              example: 'Lecturer',
            },
            specialization: {
              type: 'string',
              nullable: true,
              example: 'Agricultural Engineering',
            },
            department: {
              type: 'string',
              nullable: true,
              example: 'Faculty of Science and Technology',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2025-07-31T09:00:00Z',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2025-07-31T09:00:00Z',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message',
            },
            details: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['Validation error detail 1', 'Validation error detail 2'],
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Register routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/cohorts', cohortRoutes);
app.use('/classes', classRoutes);
app.use('/modules', moduleRoutes);
app.use('/course-offerings', courseOfferingRoutes);
app.use('/activity-logs', activityLogRoutes);
app.use('/grades', gradeRoutes);

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

console.log('Starting app.js');

// Start server
app.listen(5000, () => {
  console.log('Listening on port 5000');
  console.log('API documentation available at http://localhost:5000/api-docs');
});
