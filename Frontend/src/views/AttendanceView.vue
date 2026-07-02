<script>
import Present from "../components/Present.vue";

export default {
  name: "AttendanceView",
  components: {
    Present,
  },

  computed: {
    attendance() {
      return this.$store.state.attendancenew
        ? this.$store.state.attendancenew
        : this.$store.state.attendance
    }
  },

  mounted() {
    this.$store.dispatch("setEmployees");
    this.$store.dispatch("setAttendance");
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