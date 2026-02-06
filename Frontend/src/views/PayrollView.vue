<script>
import TableList from "../components/TableList.vue";
import { mapState } from "vuex";

export default {
  name: "PayrollView",
  components: {
    TableList,
  },
  computed: {
    ...mapState(["payrollDetailed"])
  },
  mounted() {
    this.$store.dispatch('fetchPayrollDetailed')
  }
};
</script>

<template>
  <div>
    <TableList
      :payrollDetailed="payrollDetailed"
    />
  </div>
</template>