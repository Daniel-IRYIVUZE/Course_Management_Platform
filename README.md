# Zanda College Course Management Platform

This backend service was developed by **Daniel Iryivuze** as part of a course-related summative assignment at **ALU**. The system supports academic coordination, including course allocations, facilitator activity tracking, and a multilingual student reflection page in English, French, and Kinyarwanda.

**Developer**: Daniel Iryivuze  
**Institution**: African Leadership University, Rwanda  
**Submission Date**: July 31, 2025  
**Demo Video**: [Watch the walkthrough](https://youtu.be/your-demo-link-here)  
**Reflection Page**: [View Deployed Student Reflection Page](https://daniel-iryivuze.github.io/Course_Management_Platform/)

---

## Project Overview

This project consists of three main modules:

1. **Course Allocation System** – Managers assign facilitators to courses and cohorts.
2. **Facilitator Activity Tracker (FAT)** – Facilitators log weekly academic activities.
3. **Student Reflection Page** – Multilingual static page built with HTML, CSS, and JS to demonstrate i18n support.

The system is built using **Node.js**, **Express.js**, **MySQL**, **Sequelize**, **Redis**, and **JWT-based authentication**. It follows best practices for API design, code modularity, and secure data handling.

---

## Features

### Course Allocation System

- Managers can create, update, and assign modules to facilitators.
- Facilitators can view their assigned modules only.
- Course offerings are defined by module, class, trimester, cohort, intake (HT1, HT2, FT), and delivery mode (Online/In-person).
- Role-based access control ensures only managers can modify allocations.

### Facilitator Activity Tracker (FAT)

- Facilitators submit weekly activity logs for assigned modules.
- Logs include attendance, grading, moderation, intranet sync, and gradebook status.
- Redis is used for queuing reminders and notifying managers about submission status.
- Background workers process reminders and record delivery.

### Student Reflection Page (i18n)

- Static multilingual page hosted at: [https://daniel-iryivuze.github.io/Course_Management_Platform/](https://daniel-iryivuze.github.io/Course_Management_Platform/)
- Supports English, French, and Kinyarwanda.
- Includes 3 reflection questions and a language switcher.
- Uses JavaScript to dynamically switch languages based on user input.

---

## Technologies Used

- **Backend**: Node.js, Express.js, Sequelize ORM
- **Database**: MySQL
- **Queueing**: Redis with Bull
- **Authentication**: JWT, bcrypt
- **Documentation**: Swagger (OpenAPI)
- **Testing**: Jest
- **Frontend (i18n)**: HTML, CSS, Vanilla JavaScript

---

## Installation & Setup

### Requirements

- Node.js ≥ v18
- MySQL ≥ v8
- Redis ≥ v6

### Clone & Install

```bash
# Clone the project
git clone https://github.com/Daniel-IRYIVUZE/Course_Management_Platform.git

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
````

### Configure `.env`

Edit your `.env` file with:

```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=course_db
DB_USER=root
DB_PASSWORD=yourpassword
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://127.0.0.1:6379
```

### Run Application

```bash
npm install

# Start development server
npm run dev
```

Visit: `http://localhost:5000/api-docs` for API documentation.

---

## API Overview

The full API is documented with Swagger.

### Example Endpoints

* `POST /api/auth/login` – Authenticate user
* `GET /api/allocations` – List course allocations
* `POST /api/activity-logs` – Submit weekly facilitator log

Role-based middleware ensures correct access rights.

---

## Testing

Run unit tests with:

```bash
npm run test
```

Tests cover:

* Authentication logic
* Allocation and activity services
* Utilities and model validation

---

## Folder Structure

```
COURSE_MANAGEMENT_PLATFORM/
├── config/
├── connection/
├── controllers/
├── middleware/
├── models/
├── queues/
├── routes/
├── services/
├── swagger/
├── tests/
├── workers/               
├── index.html
├── index.js
├── translations.js
└── styles.css
├── app.js
├── .env
├── package.json
└── README.md
```

---

## Assumptions & Notes

* Admin seeding can be added manually or via SQL import.
* Redis notifications are logged for simplicity.
* No file uploads were required for this version.
* The student reflection page is static and frontend-only.

---

## Submission Summary

* **Backend Functionality** (Auth, Allocations, FAT, Redis)
* **Multilingual Frontend Page** (EN, FR, KI)
* **API Documentation via Swagger**
* **Unit Tests with Jest**
* **GitHub-hosted Code & Deployed Reflection Page**
* **Demo Video**: [Click to watch](https://youtu.be/your-demo-link-here)

---

## Academic Integrity

This project is the original work of **Daniel Iryivuze** and complies with academic integrity policies. External tools and documentation were referenced appropriately. All logic and implementation reflect personal understanding and effort.

---