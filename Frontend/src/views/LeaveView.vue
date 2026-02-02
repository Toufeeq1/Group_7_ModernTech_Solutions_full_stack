<script>
import { mapState } from 'vuex';
import List from "../components/List.vue";

export default {
    name: "LeaveView",
    components: {
        List,
    },
    computed: {
        ...mapState(["attendance"]),
    }
};
</script>

<template>
    {{ console.log(attendance) }}
  <div>
    <List
      :attendanceData="attendance"
    />
    
  </div>
</template>