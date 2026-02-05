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

// Get Attendance
app.get("/attendance", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM employee_data.attendance"
  );

  res.json({
    message: "Attendance route accessed",
    status: "GET request successful",
    data: rows
  });
});

// POST
app.post("/attendance", async (req, res) => {
  const { employee_id, attendance_date, status } = req.body;

  await pool.query(
    `INSERT INTO employee_data.attendance 
     (employee_id, attendance_date, status)
     VALUES (?, ?, ?)`,
    [employee_id, attendance_date, status]
  );

  res.json({
    message: "Attendance accessed",
    status: "Attendance record added"
  });
});


// PATCH
app.patch("/attendance/:id", async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  console.log(req.body); 
  
  await pool.query(
    `UPDATE employee_data.attendance
     SET status = ?
     WHERE attendance_id = ?`,
    [status, id]
  );

  res.json({
    message: `Attendance saved`,
    updated_id: id,
    new_status: status
  });
});

app.listen(5050, () => {
  console.log("http://localhost:5050");
});


const getemployeesDB = async () => {
    let [data] = await pool.query('SELECT * FROM employees;')
    return data;
}


app.get('/employees', async (req, res) => {
   res.json({ info: await getemployeesDB() });
})
