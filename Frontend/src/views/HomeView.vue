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
      :employees="employeesapi"
      :attendance="attendance"
      
    />
  </div>
</template>
