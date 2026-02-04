import { getEmployeesDb } from "../models/employeesDb.js"

const getEmployeesCon  = async (req,res) => {
   res.json({employees: await getEmployeesDb()})
}
