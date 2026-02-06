<script>
import List from "../components/List.vue";
import { mapState } from "vuex";

export default {
  name: "LeaveView",
  components: {
    List,
  },
  computed: {
    ...mapState(["attendance"]),
    leaveRequestsApi() {
      return this.$store.state.leaveRequests
    },
    leaveBalanceApi() {
      return this.$store.state.leaveBalance
    },
    employeesSimpleApi() {
      return this.$store.state.employeesSimple
    }
  },
  mounted() {
    this.$store.dispatch('fetchLeaveRequests')
    this.$store.dispatch('fetchLeaveBalance')
    this.$store.dispatch('fetchEmployeesSimple')
  }
};
</script>

<template>
  <div>
    <List
      :attendanceData="attendance"
      :leaveRequests="leaveRequestsApi"
      :leaveBalance="leaveBalanceApi"
      :employeesSimple="employeesSimpleApi"
    />
  </div>
</template>