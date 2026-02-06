import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

/* =========================
   SERVER
========================= */
app.listen(5050, () => {
  console.log("✅ API running on http://localhost:5050");
});

/* =========================
   EMPLOYEES
========================= */
const getAllEmployees = async () => {
  const [rows] = await pool.query("SELECT * FROM employees");
  return rows;
};

const getBasicEmployeeInfo = async () => {
  const [rows] = await pool.query(`
    SELECT 
      employee_Id AS employeeId,
      name,
      department,
      image
    FROM employees
  `);
  return rows;
};

app.get("/employees", async (req, res) => {
  try {
    if (req.query.type === "home") {
      res.json(await getBasicEmployeeInfo());
    } else {
      res.json(await getAllEmployees());
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

/* =========================
   PAYROLL (NaN FIXED)
========================= */
const getPayrollDB = async () => {
  const [rows] = await pool.query(`
    SELECT 
      employee_Id AS employeeId,
      IFNULL(hoursWorked, 0) AS hoursWorked,
      IFNULL(leaveDeductions, 0) AS leaveDeductions,
      IFNULL(CAST(finalSalary AS DECIMAL(12,2)), 0) AS finalSalary
    FROM payroll_data
  `);
  return rows;
};

app.get("/payroll", async (req, res) => {
  try {
    res.json(await getPayrollDB());
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payroll" });
  }
});

/* =========================
   ATTENDANCE + LEAVES
   (MATCHES ORIGINAL JSON)
========================= */
const getAttendanceWithLeaves = async () => {
  const [employees] = await pool.query(`
    SELECT employee_Id AS employeeId, name
    FROM employees
  `);

  const [attendanceRows] = await pool.query(`
    SELECT 
      employee_Id AS employeeId,
      DATE_FORMAT(attendance_date, '%Y-%m-%d') AS date,
      status
    FROM attendance
  `);

  const [leaveRows] = await pool.query(`
    SELECT 
      id_leave_request_employee AS employeeId,
      DATE_FORMAT(leave_data, '%Y-%m-%d') AS date,
      reason,
      status
    FROM leave_request
  `);

  return employees.map(emp => ({
    employeeId: emp.employeeId,
    name: emp.name,
    attendance: attendanceRows.filter(a => a.employeeId === emp.employeeId),
    leaveRequests: leaveRows.filter(l => l.employeeId === emp.employeeId),
  }));
};

app.get("/attendance", async (req, res) => {
  try {
    res.json(await getAttendanceWithLeaves());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

/* =========================
   LEAVE REQUESTS (TABLE)
========================= */
const getLeaveRequestsDB = async () => {
  const [rows] = await pool.query(`
    SELECT 
      lr.leave_Id AS leaveId,
      lr.id_leave_request_employee AS employeeId,
      e.name AS employeeName,
      e.image AS employeeImage,
      DATE_FORMAT(lr.leave_data, '%Y-%m-%d') AS date,
      lr.reason,
      lr.status
    FROM leave_request lr
    JOIN employees e 
      ON e.employee_Id = lr.id_leave_request_employee
    ORDER BY lr.leave_data DESC
  `);
  return rows;
};

app.get("/leave-requests", async (req, res) => {
  try {
    res.json(await getLeaveRequestsDB());
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leave requests" });
  }
});

/* =========================
   LEAVE BALANCE
========================= */
const getLeaveBalanceDB = async () => {
  const [rows] = await pool.query(`
    SELECT 
      id_leave_request_employee AS employeeId,
      reason AS leaveType,
      COUNT(*) AS usedDays
    FROM leave_request
    WHERE status = 'Approved'
    GROUP BY id_leave_request_employee, reason
  `);
  return rows;
};

app.get("/leave-balance", async (req, res) => {
  try {
    res.json(await getLeaveBalanceDB());
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leave balance" });
  }
});

/* =========================
   CREATE LEAVE REQUEST
========================= */
app.post("/leave-requests", async (req, res) => {
  try {
    const { employeeId, startDate, reason } = req.body;

    if (!employeeId || !startDate || !reason) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const [result] = await pool.query(
      `
      INSERT INTO leave_request 
        (id_leave_request_employee, leave_data, reason, status)
      VALUES (?, ?, ?, 'Pending')
      `,
      [employeeId, startDate, reason]
    );

    res.json({
      success: true,
      leaveId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create leave request" });
  }
});

/* =========================
   UPDATE LEAVE STATUS
========================= */
app.patch("/leave-requests/:leaveId", async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;

    if (!["Approved", "Denied", "Pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    await pool.query(
      `UPDATE leave_request SET status = ? WHERE leave_Id = ?`,
      [status, leaveId]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update leave request" });
  }
});

/* =========================
   SIMPLE EMPLOYEE LIST
========================= */
app.get("/employees/simple", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT employee_Id AS employeeId, name
      FROM employees
      ORDER BY name
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});
