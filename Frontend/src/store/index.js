import { createStore } from 'vuex'
import employeeData from '@/assets/data/employee_info.json'
import attendanceData from '@/assets/data/attendance.json'
import payrollData from '@/assets/data/payroll_data.json'
import axios from 'axios'

const store = createStore({
  state: {
    employees: employeeData.employeeInformation,
    attendance: attendanceData.attendanceAndLeave,
    payroll: payrollData.payrollData,
    employeesnew: null,
    attendancenew: null
  },

  mutations: {
    setEmployees(state, payload) {
      state.employeesnew = payload
    },

    setAttendance(state, payload) {
      state.attendancenew = payload
    }
  },

  actions: {
    async setEmployees({ commit }) {
      try {
        const res = await axios.get('http://localhost:5050/employees')
        console.log(res.data.info)
        commit('setEmployees', res.data.info)
      } catch (error) {
        console.error('Failed to fetch employees:', error)
      }
    },

    async setAttendance({ commit }) {
      try {
        const res = await axios.get('http://localhost:5050/attendance')
        console.log(res.data.info)
        commit('setAttendance', res.data.info)
      } catch (error) {
        console.error('Failed to fetch attendance:', error);
      }
    }
  }
})

export default store
