<script>
import { mapState } from "vuex";

import PerformaceItems from "../components/PerformaceItems.vue";
export default {
  name: "PerformaceView",
  components: {
    PerformaceItems,
  },
  computed: {
    ...mapState(["employees"]),
  },
};
</script>

<template>
  <div>
    <PerformaceItems
      :employees="employees"
    />
  </div>
</template>
