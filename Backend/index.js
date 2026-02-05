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


const getEmployeesDB = async () => {
    let [data] = await pool.query('SELECT * FROM employees;')
    return data;
}

const getEmployeesIdDB =async (id) => {
  let [data] = await pool.query('SELECT * FROM employees WHERE employee_Id = ?;',
    [id]
   )
   return data[0]
}

const addEmployeeDB = async (employee) => {
  const { name, position, department, salary, employmentHistory, contact } = employee;

  const [result] = await pool.query(
    `INSERT INTO employees (name, position, department, salary, employmentHistory, contact)
    //  VALUES (?, ?, ?, ?, ?, ?)`,
     [name, position, department, salary, employmentHistory, contact]
  )

  return result;
}

const deleteEmployeeDB = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM employees WHERE employee_Id = ?;",
    [id]
  );
  return result;
};

app.get('/employees', async (req, res) => {
  try{res.json({ info: await getEmployeesDB() });
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}) 

app.post("/employees", async (req, res) => {
  try {
    await addEmployeeDB(req.body);
    res.json({ message: "Employee added successfully" });
  } catch (error) {
    res.status(5050).json({ error: error.message });
  }
});

app.delete("/employees/:id", async (req, res) => {
  try {
    await deleteEmployeeDB(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(5050).json({ error: error.message });
  }
});

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
