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
    employeesnew() {
      return this.$store.state.employeesnew
    },
  },
  mounted() {
  this.$store.dispatch('setEmployees')
}
};
</script>

<template>
  <div>
    <HomePage
      :payrollData="payroll"
      :employees="employees"
      :attendance="attendance"
      :employeesnew="employeesnew"
    />
  </div>
</template>
