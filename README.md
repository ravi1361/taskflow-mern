# TaskFlow — Full-Stack Task Management Application

A clean, responsive, full-stack task management application built using the **MERN stack** (MongoDB, Express.js, React, Node.js). Inspired by Linear's restrained typography, spacing, and information hierarchy, TaskFlow features complete CRUD functionality, live dashboard metrics, real-time search, multi-criteria filtering, sorting, form validation, and dark/light mode support.

---

## 🔗 Repository & Links

* **GitHub Repository:** [https://github.com/ravi1361/taskflow-mern](https://github.com/ravi1361/taskflow-mern)
* **Frontend Deployment:** *[Pending Vercel Deployment]*
* **Backend API Deployment:** *[Pending Render Deployment]*

---

## ✨ Features

* **Interactive Dashboard:**
  * Live metric cards displaying Total Tasks, In Progress, Pending, and Completed tasks.
  * Recent tasks preview with quick status toggles.
  * System health indicator connected directly to MongoDB Atlas.
* **Complete CRUD Operations:**
  * **Create:** Add tasks with title, description, priority, status, and optional due dates.
  * **Read:** View tasks in a responsive table (desktop) and card format (mobile).
  * **Update:** In-place status dropdowns and detailed edit modal with pre-populated fields.
  * **Delete:** Safe delete action guarded by a confirmation dialog to prevent accidental removal.
* **Search, Filters & Sorting:**
  * Real-time search by task title.
  * Filter by workflow status (`pending`, `in-progress`, `completed`).
  * Filter by priority level (`low`, `medium`, `high`).
  * Sort by newest, oldest, or due date.
* **UI/UX Polish:**
  * **Light & Dark Theme:** Full theme persistence with instant toggle.
  * **Feedback & Notifications:** Toast notifications for all network operations.
  * **Loading States:** Skeleton loaders for metrics and table rows.
  * **Empty States:** Clear guidance when no tasks match current filters.
  * **Input Validation:** Prevents empty titles, enforces length limits, and displays field-level errors.

---

## 🛠️ Tech Stack

### Frontend
* **React 19** + **Vite**: Modern build tooling and component rendering.
* **Tailwind CSS v4**: Utility-first styling with custom dark-mode variant.
* **React Router DOM v7**: Client-side single-page routing.
* **Axios**: HTTP client with request/response interceptors.
* **Lucide React**: Minimal, consistent iconography.

### Backend
* **Node.js** & **Express.js**: REST API architecture with ES modules.
* **MongoDB Atlas** & **Mongoose**: Cloud document database with strict schema validation, enums, and timestamps.
* **Helmet**: HTTP security headers.
* **CORS**: Origin access control.
* **express-rate-limit**: Abuse prevention and rate limiting.
* **Morgan**: HTTP request logging.

---

## 📁 Project Structure

```text
taskflow-mern/
├── client/                        # React Frontend (Vite)
│   ├── src/
│   │   ├── components/            # Reusable UI (Badges, Modals, StatCards, Skeletons)
│   │   ├── context/               # ThemeContext and ToastContext
│   │   ├── layouts/               # MainLayout (Sidebar + Header + Content)
│   │   ├── pages/                 # Dashboard and TasksPage
│   │   ├── services/              # Axios API client (taskService)
│   │   ├── utils/                 # Date formatters and helpers
│   │   ├── App.jsx                # Application root with routes and providers
│   │   ├── index.css              # Global styles & Tailwind v4 configuration
│   │   └── main.jsx               # React entry point
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/                        # Express Backend (Node.js)
│   ├── src/
│   │   ├── config/                # MongoDB Atlas connection (db.js)
│   │   ├── controllers/           # Business logic (taskController.js)
│   │   ├── middleware/            # Error handling & 404 middleware
│   │   ├── models/                # Mongoose Task schema (Task.js)
│   │   ├── routes/                # REST endpoints (taskRoutes.js)
│   │   ├── app.js                 # Express application configuration
│   │   └── server.js              # Server entry point
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Backend and database health check | `200 OK` |
| **GET** | `/api/tasks/stats` | Dashboard statistics (total, completed, pending, in-progress) | `200 OK` |
| **GET** | `/api/tasks` | Fetch tasks (supports `search`, `status`, `priority`, `sort`) | `200 OK` |
| **GET** | `/api/tasks/:id` | Fetch single task by MongoDB ID | `200 OK` / `404 Not Found` |
| **POST** | `/api/tasks` | Create a task (title required) | `201 Created` / `400 Bad Request` |
| **PUT** | `/api/tasks/:id` | Update an existing task | `200 OK` / `400 Bad Request` |
| **DELETE** | `/api/tasks/:id` | Delete a task | `200 OK` / `404 Not Found` |

---

## ⚙️ Local Development Setup

### Prerequisites
* **Node.js**: v18+ (LTS recommended)
* **npm**: v9+
* **MongoDB Atlas** account (or local MongoDB instance)

### 1. Clone the repository
```bash
git clone git@github.com-ravi:ravi1361/taskflow-mern.git
cd taskflow-mern
```

### 2. Configure Backend
```bash
cd server
npm install
cp .env.example .env
```
Edit `server/.env`:
```env
PORT=5001
MONGODB_URI=your_mongodb_atlas_connection_string
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
Start the backend server:
```bash
npm run dev
```

### 3. Configure Frontend
Open a new terminal:
```bash
cd client
npm install
cp .env.example .env
```
Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```
Start the frontend development server:
```bash
npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## 🚀 Deployment Guide

### Backend on Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your `taskflow-mern` GitHub repository.
3. Set **Root Directory** to `server`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `npm start`.
6. Add Environment Variables:
   * `MONGODB_URI` = `your_atlas_connection_string`
   * `CLIENT_URL` = `https://your-app.vercel.app`
   * `NODE_ENV` = `production`

### Frontend on Vercel
1. Import your `taskflow-mern` repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Set **Framework Preset** to `Vite`.
4. Add Environment Variable:
   * `VITE_API_URL` = `https://your-render-service.onrender.com/api`
5. Click **Deploy**.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
