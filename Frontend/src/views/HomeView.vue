<script>
import HomePage from "@/components/HomePage.vue";
import { mapState } from "vuex";

export default {
  name: "HomeView",
  components: {
    HomePage,
  },
  computed: {
    ...mapState(["payroll", "employees", "attendance"]),
    employeesapi() {
      return this.$store.state.employeesnew
    },
    payrollapi() {
      return this.$store.state.payrollnew
    },
    attendanceapi() {
      return this.$store.state.attendancenew
    }
  },
  mounted() {
  this.$store.dispatch('setEmployees'),
  this.$store.dispatch('setAttendance')
  this.$store.dispatch('setPayroll')

}
};
</script>

<template>
  <div>
    <HomePage
      :payroll="payrollapi"
      :employees="employeesapi"
      :attendance="attendanceapi"
    />
  </div>
</template>
