import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

app.listen(5050, () => {
  console.log("http://localhost:5050");
});

const getAllEmployees = async () => {
  const [rows] = await pool.query("SELECT * FROM employees");
  return rows;
};

const getBasicEmployeeInfo = async () => {
  const [rows] = await pool.query("SELECT employee_Id AS employeeId, name, department, image FROM employees");
  return rows;
};

app.get("/employees", async (req, res) => {
  const { type } = req.query;

  if (type === "home") {
    res.json(await getBasicEmployeeInfo());
  } else {
    res.json(await getAllEmployees());
  }
});


const getPayrollDB = async () => {
  const [rows] = await pool.query(`
    SELECT 
      employee_Id AS employeeId,
      hoursWorked,
      leaveDeductions,
      CAST(finalSalary AS DECIMAL(12,2)) AS finalSalary
    FROM payroll_data
  `);
  return rows;
};

app.get("/payroll", async (req, res) => {
  res.json(await getPayrollDB());
});


const getAttendanceWithLeaves = async () => {
  const [employees] = await pool.query("SELECT employee_Id AS employeeId FROM employees");

  const [attendanceRows] = await pool.query(`
    SELECT 
      employee_Id AS employeeId,
      attendance_date AS date,
      status
    FROM attendance
  `);

  const [leaveRows] = await pool.query(`
    SELECT 
      id_leave_request_employee AS employeeId,
      leave_data AS date,
      reason,
      status
    FROM leave_request
  `);

  const result = employees.map(emp => {
    return {
      employeeId: emp.employeeId,
      attendance: attendanceRows.filter(a => a.employeeId === emp.employeeId),
      leaveRequests: leaveRows.filter(lr => lr.employeeId === emp.employeeId)
    };
  });

  return result;
};

app.get("/attendance", async (req, res) => {
  try {
    const data = await getAttendanceWithLeaves();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


