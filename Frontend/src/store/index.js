import { createStore } from 'vuex';
import employeeData from '@/assets/data/employee_info.json';
import attendanceData from '@/assets/data/attendance.json';
import payrollData from '@/assets/data/payroll_data.json';


const store = createStore({
    state:{
    employees: employeeData.employeeInformation,
    attendance: attendanceData.attendanceAndLeave,
    payroll: payrollData.payrollData,
    employeesnew: null
    },
    mutations:{
        setEmployees(state, payload) {
      state.employeesnew = payload
    }
    },
    actions:{
         setEmployees({ commit }) {
      fetch('http://localhost:5050/employees')
        .then(res => res.json())
        .then(res => {
          console.log(res.info);
          commit('setEmployees', res.info)
    })
    }
    }
});
export default store