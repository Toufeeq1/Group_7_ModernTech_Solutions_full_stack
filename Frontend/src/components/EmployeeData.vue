<script>
export default {
  name: "EmployeeData",
  props: {
    employees: Array,
    
  },
  computed: {
    mounted: {
      workers() {
      this.$store.state.employees
    },
  },
},
};
</script>

<template>
  <h2>Employee Data</h2>
  <div class="container">
    <div class="card-container">
      <!-- {{ this.$store.state.employees }} -->
      <div class="card" v-for="employee in this.$store.state.employees " :key="employee.employee_id">
        <div class="cards">
          <v-card class="mx-auto" max-width="344"></v-card>
        </div>

        <v-img height="400px" :src="employee.image" cover></v-img>

        <v-card-title>
          <div class="form-row">
            <b><label for="name"></label></b>
            <b
              ><span id="name">{{ employee.name }}</span></b
            >
          </div>
        </v-card-title>

        <v-card-subtitle>
          <div class="form-row">
            <label for="position"></label>
            <span id="position">{{ employee.position }}</span>
          </div>
        </v-card-subtitle>

        <v-card-actions>
          <v-btn
            color="orange-lighten-2"
            text="More Info"
            @click="employee.show = !employee.show"
          ></v-btn>

          <v-spacer></v-spacer>

          <v-btn
            :icon="employee.show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            @click="employee.show = !employee.show"
          ></v-btn>
        </v-card-actions>

        <v-expand-transition>
          <div v-show="employee.show">
            <v-divider></v-divider>

            <v-card-text>
              <div class="card-body">
                <div class="form-row">
                  <label for="employeeId"></label>
                  <b
                    ><span id="employeeId">{{ employee.employee_id }}</span></b
                  >
                </div>
              </div>

              <div class="form-row">
                <b><label for="department">Department: </label></b>
                <span id="department">{{ employee.department }}</span>
              </div>

              <div class="form-row">
                <b><label for="salary">Salary: </label></b>
                <span id="salary">{{ employee.salary }}</span>
              </div>

              <div class="form-row">
                <b><label for="employmentHistory">Employment History:</label></b>
                <span id="employmentHistory">{{ employee.employmentHistory }}</span>
              </div>

              <div class="form-row">
                <b><label for="contact">Contact:</label></b>
                <span id="">{{ employee.contact }}</span>
              </div>
            </v-card-text>
          </div>
        </v-expand-transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
</style>
