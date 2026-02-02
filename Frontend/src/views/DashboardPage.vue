<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>Welcome to the dashboard! You have successfully logged in.</p>
    <div class="dashboard-content">
      <v-card class="ma-4">
        <v-card-title>Welcome</v-card-title>
        <v-card-text>
          This is your dashboard. You can view employee information, attendance, and payroll data here.
        </v-card-text>
      </v-card>
      <v-card class="ma-4">
        <v-card-title>Quick Stats</v-card-title>
        <v-card-text>
          <p>Total Employees: 25</p>
          <p>Present Today: 23</p>
          <p>On Leave: 2</p>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardPage',
  data() {
    return {};
  },
};
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}

.dashboard-content {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.dashboard h1 {
  margin-bottom: 1.5rem;
}
</style>
