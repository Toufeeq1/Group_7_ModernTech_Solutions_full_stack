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
    attendancenew: null,
    employeesnew: null,
    payrollnew: null
  },

  mutations: {
    setEmployees(state, payload) {
      state.employeesnew = payload
    },
    setPayroll(state, payload) {
      state.payrollnew = payload
    },
    setAttendance(state, payload) {
      state.attendancenew = payload
    }
  },

  actions: {
    async setEmployees({ commit }) {
      try {
        const res = await axios.get('http://localhost:5050/employees?type=home')
        commit('setEmployees', res.data)
      } catch (error) {
        console.error('Failed to fetch employees:', error)
      }
    },
    async setPayroll({ commit }) {
      try {
        const res = await axios.get('http://localhost:5050/payroll')
        commit('setPayroll', res.data)
      } catch (error) {
        console.error('Failed to fetch payroll:', error)
      }
    },
    async setAttendance({ commit }) {
      try {
        const res = await axios.get('http://localhost:5050/attendance')
        commit('setAttendance', res.data)
      } catch (error) {
        console.error('Failed to fetch attendance:', error)
      }
    }
  }
})

export default store
