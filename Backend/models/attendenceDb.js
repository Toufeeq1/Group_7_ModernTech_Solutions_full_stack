import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const getEmployeesDb = async () => { 
    let [data] = await pool.query('SELECT * FROM employees;')
    return data 
}

export {getEmployeesDb}

