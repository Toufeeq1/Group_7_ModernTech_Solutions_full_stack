import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PayrollView from '@/views/PayrollView.vue'
import EmployeeView from '@/views/EmployeeView.vue'
import PerformaceView from '@/views/PerformaceView.vue'
import ReportView from '@/views/ReportView.vue'
import LeaveView from '@/views/LeaveView.vue'
import AttendanceView from '@/views/AttendanceView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/Payroll',
      name: 'Payroll',
      component: PayrollView,
    },
     {
      path: '/Employees',
      name: 'Employees',
      component: EmployeeView,
    },
    {
      path: '/Performace',
      name: 'Performace',
      component: PerformaceView,
    },
    {
      path: '/Reports',
      name: 'Reports',
      component: ReportView,
    },
    {
      path: '/Leave',
      name: 'Leave',
      component: LeaveView,
    },
    {
      path:'/Attendance',
      name:'/Attendance',
      component: AttendanceView
    }
  ],
})

export default router
