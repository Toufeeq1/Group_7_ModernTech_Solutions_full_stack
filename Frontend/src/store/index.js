import { createStore } from 'vuex';
import employeeData from '@/assets/data/employee_info.json';
import attendanceData from '@/assets/data/attendance.json';
import payrollData from '@/assets/data/payroll_data.json';

const store = createStore({
    state:{
    employees: employeeData.employeeInformation,
    attendance: attendanceData.attendanceAndLeave,
    payroll: payrollData.payrollData,
    },
    mutations:{
    },
    actions:{
    }
});
export default store