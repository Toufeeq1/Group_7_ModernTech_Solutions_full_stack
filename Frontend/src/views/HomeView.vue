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
    attendanceapi() {
      return this.$store.state.attendancenew 
    }
  },
};
</script>

<template>
  <div>
    <HomePage
      :payrollData="payroll"
      :employees="employees"
      :attendance="attendance"
    />
  </div>
</template>
