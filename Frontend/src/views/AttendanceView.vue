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
    }
};
</script>

<template>
  <div>
    <Present
      :attendanceData="attendance"
    />
  </div>
</template>