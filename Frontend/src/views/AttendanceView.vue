<script>
import { mapState } from 'vuex';
import Present from "../components/Present.vue";


export default {
    name: "AttendanceView",
    components: {
        Present,
    },
    computed: {
        ...mapState(["attendance"]),
    },
    mounted() {
    this.$store.dispatch("setEmployees");
  }
};
</script>


<template>
  <div>
    <Present
      :attendanceData="attendance"
    />
    <p>{{ console.log($store.state.employeesnew) }}</p>
  </div>
</template>