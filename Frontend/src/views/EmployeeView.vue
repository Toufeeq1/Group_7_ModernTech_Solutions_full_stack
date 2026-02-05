<script>
import EmployeeData from "../components/EmployeeData.vue";
import { mapState } from "vuex";


export default {
  name: "EmployeeView",
  computed: {
    ...mapState(["employees"]),
  },
  components: {
    EmployeeData,
  },
  mounted() {
    this.$store.dispatch("setEmployees");
  }
};
</script>

<template>
  <div>
    <EmployeeData
     :employees="employees",
     />
  </div>
</template>
