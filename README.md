# Exam Result & Report Card System (PS2)

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application built for academic institutions and examination cells to manage examinations, enter subject marks, auto-compute grades and pass/fail statuses, handle ties in rank calculation, and generate printable student report cards.

---

## 📌 Problem Statement Overview
- **Problem Statement ID:** PS2
- **Domain:** Education / Examination
- **User Roles:**
  - **Exam Cell / Admin:** Exam CRUD, subject configuration, marks evaluation per student, publish/unpublish exam results, view analytics dashboard.
  - **Student:** View published exam results, access detailed subject-wise grade report cards with class ranks, print official report cards.

---

## ✨ Features

### 1. Authentication & Role-Based Access Control
- Secure registration and login using JWT (JSON Web Tokens) and bcrypt password hashing.
- Student profiles store roll number and current semester.
- Protected routes on both backend and frontend (`ProtectedRoute` with role-based redirection).

### 2. Examination Management (Admin CRUD)
- Create and edit exams with custom subject lists.
- For each subject: specify Subject Name, Maximum Marks, and Minimum Passing Marks.
- Publish / Unpublish results toggle: students can only view results of published exams.
- Reusable form component (`ExamForm.jsx`) for both Add and Edit operations.

### 3. Marks Entry & Business Rule Validation
- Admin selects a student and inputs subject marks.
- **Backend Business Rule Enforcement:** Rejects marks that are negative or exceed the subject's maximum marks.
- **Automatic Calculations:**
  - Total marks obtained and total maximum marks.
  - Percentage scored (rounded to 2 decimal places).
  - Subject-level pass/fail validation.
  - **Strict Passing Rule:** A student is marked as **Fail** (Grade `F`) if they score below the pass mark in even a single subject, regardless of aggregate score.
  - **Grade Thresholds:**
    - `A+` : ≥ 90%
    - `A`  : 80% – 89.99%
    - `B`  : 70% – 79.99%
    - `C`  : 60% – 69.99%
    - `D`  : 50% – 59.99%
    - `F`  : Below 50% or failed in any subject.

### 4. Admin Dashboard Analytics
- Overall pass percentage metric with total pass vs fail counts.
- Total exams created and published count.
- Registered student count and evaluated marksheets count.
- Subject-wise performance table showing average and highest marks scored.
- Top 5 meritorious students list across published exams.

### 5. Official Report Card & Stretch Goals
- **Class Rank with Tie Handling:** Students with equal percentages receive the same class rank without skipping ranks incorrectly.
- **Printable Report Card:** Built-in print action using clean print CSS (`@media print`) that removes web navigation and buttons for a clean physical printout.

---

## 🛠️ Tech Stack
- **Frontend:** React 18, React Router DOM v6, Vite, Vanilla CSS
- **Backend:** Node.js, Express.js (REST API, JSON only)
- **Database:** MongoDB Atlas with Mongoose ODM
- **Authentication:** JWT, bcryptjs

---

## 📁 Project Structure

```
WebAssignment-6/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── examController.js
│   │   └── resultController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Exam.js
│   │   ├── Result.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── examRoutes.js
│   │   └── resultRoutes.js
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   ├── authApi.js
│   │   │   ├── examApi.js
│   │   │   └── resultApi.js
│   │   ├── components/
│   │   │   ├── ExamForm.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ExamFormPage.jsx
│   │   │   ├── ExamList.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MarksEntry.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ReportCard.jsx
│   │   │   └── StudentResults.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm
- MongoDB Atlas database URI (or local MongoDB)

### 1. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_here
```

Seed the database with sample students, exams, and marks:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
# Server will run on http://localhost:5001
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` folder:
```env
VITE_API_URL=http://localhost:5001/api
```

Start the Vite development server:
```bash
npm run dev
# Frontend will run on http://localhost:5173
```

---

## 🔑 Test Login Credentials

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin (Exam Cell)** | `admin@college.edu` | `admin123` | Full access to exams, marks entry, and dashboard |
| **Student** | `aarav@college.edu` | `student123` | Semester 4 student (Roll No: `CS202601`) |
| **Student (Alternative)** | `diya@college.edu` | `student123` | Semester 4 student (Roll No: `CS202602`) |

*(The login page also provides 1-click quick fill buttons for these credentials).*

---

## 📡 REST API Documentation

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register student or admin account |
| `POST` | `/api/auth/login` | Public | Login and receive JWT token |
| `GET` | `/api/auth/me` | Protected | Get current logged-in user profile |
| `GET` | `/api/auth/students` | Admin Only | Get list of students (filtered by semester) |

### Exam Routes (`/api/exams`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/exams` | Protected | List all exams (Admin) or published exams (Student) |
| `POST` | `/api/exams` | Admin Only | Create new exam with subjects configuration |
| `GET` | `/api/exams/:id` | Protected | Fetch exam details by ID |
| `PUT` | `/api/exams/:id` | Admin Only | Update exam name, semester, and subjects |
| `DELETE` | `/api/exams/:id` | Admin Only | Delete exam and associated marks |
| `PATCH` | `/api/exams/:id/toggle-publish` | Admin Only | Publish or unpublish exam results |

### Result & Marks Routes (`/api/results`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/results` | Admin Only | Save student marks, compute grade and pass/fail |
| `GET` | `/api/results/exam/:examId` | Admin Only | Get all results and ranks for a specific exam |
| `GET` | `/api/results/my-results` | Student Only | Get published results for the logged-in student |
| `GET` | `/api/results/report-card/:examId` | Protected | Get detailed student report card with rank |
| `GET` | `/api/results/dashboard-stats` | Admin Only | Summary statistics, subject averages, top 5 students |

---

## 🎥 YouTube Video Showcase Outline

When preparing your 5–10 minute demonstration video:
1. **Title Format:**
   `Exam Result & Report Card System | MERN Stack Project | React.js, Node.js, Express & MongoDB`
2. **Video Sequence:**
   - **Introduction:** Your name, roll number, problem statement PS2.
   - **Project Overview:** Purpose of the exam evaluation platform.
   - **Tech Stack:** Node.js, Express.js, MongoDB Atlas, React.js.
   - **Live Demonstration:**
     - Admin login, examination CRUD with subjects and passing thresholds.
     - Entering student marks, demonstrating rejection of invalid scores (> max marks).
     - Showing the automatic calculation of total, percentage, grade, and pass/fail status.
     - Toggling the publish switch so students can access results.
     - Student login, viewing published exams, and opening the official report card.
     - Demonstrating tie-handling in class ranks and the print layout.
     - Admin dashboard showing pass percentage, subject-wise statistics, and top 5 students.
   - **Code Walkthrough:** Backend MVC structure (`config/`, `models/`, `controllers/`, `routes/`, `middleware/`) and frontend (`pages/`, `components/`, `api/`).
   - **Database & Deployment:** Schemas in MongoDB Atlas and live hosting links.
   - **Challenges & Learnings:** Key takeaways from state management and business rule enforcement.
