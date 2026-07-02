<script>
import { mapState } from "vuex";

import ReportsData from "../components/ReportsData.vue";
export default {
  name: "ReportView",
  components: {
    ReportsData,
  },
  computed: {
    ...mapState(["employees", "attendance", "payroll"]),
  },
  mounted() {
    this.$store.dispatch('setEmployees');
    this.$store.dispatch('setAttendance');
    this.$store.dispatch('setPayroll');
  }
};
</script>

<template>
  <div>
    <ReportsData
      :employees="employees"
      :attendance="attendance"
      :payroll="payroll"
    />
  </div>
</template>
