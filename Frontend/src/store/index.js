import { createStore } from 'vuex'
import employeeData from '@/assets/data/employee_info.json'
import attendanceData from '@/assets/data/attendance.json'
import payrollData from '@/assets/data/payroll_data.json'
import axios from 'axios'

const store = createStore({
  state: {
    employees: [],
    attendance: attendanceData.attendanceAndLeave,
    payroll: payrollData.payrollData,
    employeesnew: null
  },

  mutations: {
    setEmployees(state, payload) {
      state.employees = payload
    }
  },

  actions: {
    // async setEmployees({ commit }) {
    //   try {
    //     const res = await axios.get('http://localhost:5050/employees')
    //     console.log(res.data.info)
    //     commit('setEmployees', res.data.info)
    //   } catch (error) {
    //     console.error('Failed to fetch employees:', error)
    //   }
    // }
    async setEmployees({ commit }) {
      const {info} = await(await fetch('http://localhost:5050/employees')).json()
      commit('setEmployees', info)
    }
  }
})

export default store
