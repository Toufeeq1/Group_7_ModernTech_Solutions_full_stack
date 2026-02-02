<script>
import { mapState } from "vuex";
import TableList from "../components/TableList.vue";

export default {
  name: "PayrollView",
  components: {
    TableList,
  },
  computed: {
    ...mapState(["payroll", "employees"]),
  },
};
</script>

<template>
  <div>
    <TableList
      :payrollData="payroll"
      :employees="employees"
    />
  </div>
</template>
