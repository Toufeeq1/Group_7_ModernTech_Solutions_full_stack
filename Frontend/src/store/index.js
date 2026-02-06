import { createStore } from 'vuex'
import employeeData from '@/assets/data/employee_info.json'
import attendanceData from '@/assets/data/attendance.json'
import payrollData from '@/assets/data/payroll_data.json'
import axios from 'axios'



const store = createStore({
  state: {
    // Fallback JSON data
    employees: employeeData.employeeInformation,
    attendance: attendanceData.attendanceAndLeave,
    payroll: payrollData.payrollData,
    
    // API data
    employeesnew: null,
    attendancenew: null,
    payrollnew: null,
    
    // Leave management data
    leaveRequests: null,
    leaveBalance: null,
    employeesSimple: null,
    
    // Loading states
    loading: {
      employees: false,
      attendance: false,
      payroll: false,
      leaveRequests: false,
      leaveBalance: false
    },
    
    // Error states
    errors: {
      employees: null,
      attendance: null,
      payroll: null,
      leaveRequests: null,
      leaveBalance: null
    }
  },

  mutations: {
    setEmployees(state, payload) {
      state.employeesnew = payload
      state.loading.employees = false
      state.errors.employees = null
    },
    setPayroll(state, payload) {
      state.payrollnew = payload
      state.loading.payroll = false
      state.errors.payroll = null
    },
    setAttendance(state, payload) {
      state.attendancenew = payload
      state.loading.attendance = false
      state.errors.attendance = null
    },
    setLeaveRequests(state, payload) {
      state.leaveRequests = payload
      state.loading.leaveRequests = false
      state.errors.leaveRequests = null
    },
    setLeaveBalance(state, payload) {
      state.leaveBalance = payload
      state.loading.leaveBalance = false
      state.errors.leaveBalance = null
    },
    setEmployeesSimple(state, payload) {
      state.employeesSimple = payload
    },
    setLoading(state, { key, value }) {
      state.loading[key] = value
    },
    setError(state, { key, error }) {
      state.errors[key] = error
      state.loading[key] = false
    }
  },

  actions: {
    // ==================== EMPLOYEES ====================
    async setEmployees({ commit }) {
      commit('setLoading', { key: 'employees', value: true })
      try {
        const res = await axios.get(`http://localhost:5050/employees?type=home`)
        commit('setEmployees', res.data)
      } catch (error) {
        console.error('Failed to fetch employees:', error)
        commit('setError', { key: 'employees', error: error.message })
        throw error
      }
    },

    // ==================== PAYROLL ====================
    async setPayroll({ commit }) {
      commit('setLoading', { key: 'payroll', value: true })
      try {
        const res = await axios.get(`http://localhost:5050/payroll`)
        commit('setPayroll', res.data)
      } catch (error) {
        console.error('Failed to fetch payroll:', error)
        commit('setError', { key: 'payroll', error: error.message })
        throw error
      }
    },

    // ==================== ATTENDANCE ====================
    async setAttendance({ commit }) {
      commit('setLoading', { key: 'attendance', value: true })
      try {
        const res = await axios.get(`http://localhost:5050/attendance`)
        commit('setAttendance', res.data)
      } catch (error) {
        console.error('Failed to fetch attendance:', error)
        commit('setError', { key: 'attendance', error: error.message })
        throw error
      }
    },

    // ==================== LEAVE MANAGEMENT ====================
    async fetchLeaveRequests({ commit }) {
      commit('setLoading', { key: 'leaveRequests', value: true })
      try {
        const res = await axios.get(`http://localhost:5050/leave-requests`)
        commit('setLeaveRequests', res.data)
      } catch (error) {
        console.error('Failed to fetch leave requests:', error)
        commit('setError', { key: 'leaveRequests', error: error.message })
        throw error
      }
    },

    async fetchLeaveBalance({ commit }) {
      commit('setLoading', { key: 'leaveBalance', value: true })
      try {
        const res = await axios.get(`http://localhost:5050/leave-balance`)
        commit('setLeaveBalance', res.data)
      } catch (error) {
        console.error('Failed to fetch leave balance:', error)
        commit('setError', { key: 'leaveBalance', error: error.message })
        throw error
      }
    },

    async fetchEmployeesSimple({ commit }) {
      try {
        const res = await axios.get(`http://localhost:5050/employees/simple`)
        commit('setEmployeesSimple', res.data)
      } catch (error) {
        console.error('Failed to fetch employees list:', error)
        throw error
      }
    },

    async createLeaveRequest({ dispatch }, leaveData) {
      try {
        const res = await axios.post(`http://localhost:5050/leave-requests`, leaveData)
        // Refresh leave data after creating
        await Promise.all([
          dispatch('fetchLeaveRequests'),
          dispatch('fetchLeaveBalance')
        ])
        return res.data
      } catch (error) {
        console.error('Failed to create leave request:', error)
        throw error
      }
    },

    async updateLeaveStatus({ dispatch }, { leaveId, status }) {
      try {
        const res = await axios.patch(`http://localhost:5050/leave-requests/${leaveId}`, { status })
        // Refresh leave data after updating
        await Promise.all([
          dispatch('fetchLeaveRequests'),
          dispatch('fetchLeaveBalance')
        ])
        return res.data
      } catch (error) {
        console.error('Failed to update leave status:', error)
        throw error
      }
    },

    // ==================== BULK DATA FETCH ====================
    async fetchAllHomeData({ dispatch }) {
      return Promise.all([
        dispatch('setEmployees'),
        dispatch('setPayroll'),
        dispatch('setAttendance')
      ])
    },

    async fetchAllLeaveData({ dispatch }) {
      return Promise.all([
        dispatch('fetchLeaveRequests'),
        dispatch('fetchLeaveBalance'),
        dispatch('fetchEmployeesSimple')
      ])
    }
  },

  getters: {
    // ==================== LOADING STATES ====================
    isLoading: (state) => {
      return Object.values(state.loading).some(status => status === true)
    },
    
    isHomeDataLoading: (state) => {
      return state.loading.employees || state.loading.payroll || state.loading.attendance
    },
    
    isLeaveDataLoading: (state) => {
      return state.loading.leaveRequests || state.loading.leaveBalance
    },

    // ==================== ERROR STATES ====================
    hasErrors: (state) => {
      return Object.values(state.errors).some(error => error !== null)
    },

    // ==================== DATA GETTERS ====================
    employeesList: (state) => {
      return state.employeesnew || state.employees || []
    },

    payrollList: (state) => {
      return state.payrollnew || state.payroll || []
    },

    attendanceList: (state) => {
      return state.attendancenew || state.attendance || []
    },

    leaveRequestsList: (state) => {
      return state.leaveRequests || []
    },

    leaveBalanceList: (state) => {
      return state.leaveBalance || []
    },

    employeesSimpleList: (state) => {
      return state.employeesSimple || []
    }
  }
})

export default store