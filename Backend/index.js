import express from "express";
// import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { getEmployeesCon } from "./controllers/employeesCon";

// dotenv.config();

const app = express();
app.use(express.json());

// const pool = mysql.createPool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });
app.get('/employees', getEmployeesCon() )
app.listen(5050, () => {
  console.log("http://localhost:5050");
});