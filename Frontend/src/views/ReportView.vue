<script>
import ReportsData from "../components/ReportsData.vue";
import { mapState } from "vuex";

export default {
  name: "ReportsView",
  components: { ReportsData },

  computed: {
    ...mapState(["employeesnew", "attendancenew", "payrollDetailed"]),
  },

  mounted() {
    this.$store.dispatch("setEmployees");
    this.$store.dispatch("setAttendance");
    this.$store.dispatch("fetchPayrollDetailed");
  },
  mounted() {
    this.$store.dispatch('setEmployees');
    this.$store.dispatch('setAttendance');
    this.$store.dispatch('setPayroll');
  }
};
</script>

<template>
  <ReportsData
    :employees="employeesnew"
    :attendance="attendancenew"
    :payroll="payrollDetailed"
  />
</template>
