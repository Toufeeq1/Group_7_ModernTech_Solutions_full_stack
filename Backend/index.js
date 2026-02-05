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
  const [rows] = await pool.query("SELECT employee_Id, name, department, image FROM employees");
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


