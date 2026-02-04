import express from "express";
// import mysql from "mysql2/promise";
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


const getemployeesDB = async () => {
    let [data] = await pool.query('SELECT * FROM employees;')
    return data;
}


app.get('/employees', async (req, res) => {
   res.json({ info: await getemployeesDB() });
})
