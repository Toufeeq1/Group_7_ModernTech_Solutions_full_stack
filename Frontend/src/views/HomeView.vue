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
