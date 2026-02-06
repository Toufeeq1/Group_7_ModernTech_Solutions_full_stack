# ModernTech Solutions Payroll Management System

Full-stack web application for HR and payroll management. The system centralizes employee data, tracks attendance and leave requests, and manages payroll with analytics and PDF payslip generation.

## Features
- Employee directory with profile details
- Payroll management (view, create, update, delete)
- Attendance tracking and leave requests
- Leave balance summary
- Payroll analytics charts
- Payslip generation as PDF
- Responsive UI

## Tech Stack
- Frontend: Vue 3, Vite, Vuetify, Vuex, Axios, Chart.js, jsPDF, html2canvas
- Backend: Node.js, Express, MySQL, mysql2, dotenv, cors
- Database: MySQL 8.x

## Project Structure
- `Frontend/` Vite + Vue 3 client
- `Backend/` Express API and database access
- `Backend/Dump20260205 (2).sql` MySQL schema + seed data

## Prerequisites
- Node.js `20.19.0` or `>=22.12.0`
- npm (comes with Node)
- MySQL 8.x running locally

## Setup and Run

### 1) Database
import the dump:

Backend/Dump20260205 (2).sql


If `mysql` is not on your PATH, use MySQL Workbench or the full path to `mysql.exe`.

### 2) Backend (API)

```bash
cd Backend
npm install
```

Create or update `Backend/.env` with your local credentials:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=employee_data
```

Start the API:

```bash
nodemon
```

API runs at `http://localhost:5050`.


### 3) Frontend (Client)

```bash
cd Frontend
npm install
npm run dev
```

Vite runs at `http://localhost:5173` by default.

Login credentials (hardcoded in the UI):
- Email: `admin@example.com`
- Password: `password123`

## API Endpoints

Employees
- `GET /employees` full employee list
- `GET /employees?type=home` basic info for home view
- `GET /employees/simple` id + name list

Payroll
- `GET /payroll` summary data
- `GET /payroll/detailed` joined payroll + employee info
- `POST /payroll` create payroll entry
- `PATCH /payroll/:payrollId` update payroll entry
- `DELETE /payroll/:payrollId` delete payroll entry

Attendance and Leave
- `GET /attendance` attendance + leave data merged by employee
- `GET /leave-requests` leave request list
- `POST /leave-requests` create request
- `PATCH /leave-requests/:leaveId` update request status
- `GET /leave-balance` aggregated approved leave days

## Configuration Notes
- The frontend API base URL is hardcoded to `http://localhost:5050` in `Frontend/src/store/index.js`.
  - If you change the backend port or host, update that file.
- If the API is unreachable, the UI falls back to local JSON data in `Frontend/src/assets/data/`.

## Common Issues
- Database connection errors: verify `Backend/.env` credentials and that MySQL is running.
- 500 errors from API: confirm the `employee_data` database is created and the dump import succeeded.

## 👥 Team Members

| Name            | Role                | 
|-----------------|---------------------|
| Toufeeq Farat   | Developer           | 
| Tamryn Ripepi   | Developer           | 
| Lina Ngubombi   | Developer           | 