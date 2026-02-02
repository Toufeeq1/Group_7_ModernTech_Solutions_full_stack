<script>
export default {
  name: "PerformanceManagement",
  props: {
    employees: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      reviews: {},
    };
  },
  computed: {
    averageRating() {
      if (!this.employees.length) return 0;
      const employeesWithRating = this.employees.filter((e) => e.rating);
      if (!employeesWithRating.length) return 0;
      const sum = employeesWithRating.reduce((total, employee) => total + employee.rating, 0);
      return (sum / employeesWithRating.length).toFixed(1);
    },
    reviewsCompleted() {
      return this.employees.filter((e) => this.reviews[e.employeeId]?.reviewStatus === "completed")
        .length;
    },
    pendingReviews() {
      return this.employees.filter(
        (e) => !this.reviews[e.employeeId] || this.reviews[e.employeeId]?.reviewStatus === "pending"
      ).length;
    },
    goalCompletion() {
      if (!this.employees.length) return 0;
      const employeesWithGoals = this.employees.filter((e) => e.goalCompletion !== undefined);
      if (!employeesWithGoals.length) return 0;
      const sum = employeesWithGoals.reduce(
        (total, employee) => total + employee.goalCompletion,
        0
      );
      return Math.round(sum / employeesWithGoals.length);
    },
  },
  methods: {
    getReviewData(employeeId) {
      if (!this.reviews[employeeId]) {
        this.reviews[employeeId] = {
          performanceRating: 0,
          potentialRating: 0,
          cultureFitRating: 0,
          achievements: "",
          futureProjects: "",
          reviewStatus: "pending",
        };
      }
      return this.reviews[employeeId];
    },
    saveReview(employee) {
      const reviewData = this.getReviewData(employee.employeeId);
      reviewData.reviewStatus = "completed";

      employee.reviewStatus = "completed";
    },
  },
};
</script>

<template>
  <div>
    <v-card flat class="mb-8">
      <v-card-title class="text-h5 font-weight-bold">Performance Management</v-card-title>
      <v-card-subtitle>Track employee performance and development</v-card-subtitle>
      <v-row class="mt-3" no-gutters>
        <v-col cols="12" sm="6" md="6" class="pa-2">
          <v-card class="rounded-lg" elevation="2">
            <v-card-text class="pa-4">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-caption">Reviews Completed</div>
                  <div class="text-h4 font-weight-bold">{{ reviewsCompleted }}</div>
                </div>
                <v-icon color="green-darken-2" size="32">mdi-check-circle</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="6" class="pa-2">
          <v-card class="rounded-lg" elevation="2">
            <v-card-text class="pa-4">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-caption">Pending Reviews</div>
                  <div class="text-h4 font-weight-bold">{{ pendingReviews }}</div>
                </div>
                <v-icon color="amber-darken-2" size="32">mdi-alert</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <v-col cols="12" class="mb-4">
          <h2 class="text-h5 font-weight-medium">Performance Items</h2>
        </v-col>
        <v-col
          v-for="employee in employees"
          :key="employee.employeeId"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="2"
          class="pa-2"
        >
          <v-card class="mx-auto h-100 d-flex flex-column" elevation="2" rounded="lg">
            <v-card-item>
              <template v-slot:prepend>
                <v-avatar color="primary">
                  <v-icon icon="mdi-account"></v-icon>
                </v-avatar>
              </template>
              <v-card-title class="text-h6">{{ employee.name }}</v-card-title>
              <v-card-subtitle>{{ employee.position }}</v-card-subtitle>
            </v-card-item>
            <v-card-text class="grow">
              <div class="d-flex align-center mb-2">
                <v-icon icon="mdi-email" size="small" class="mr-2"></v-icon>
                <span>{{ employee.contact || "N/A" }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <v-icon icon="mdi-office-building" size="small" class="mr-2"></v-icon>
                <span>{{ employee.department || "N/A" }}</span>
              </div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <div class="pa-4 text-center">
                <v-dialog :max-width="$vuetify.display.mobile ? '100%' : '800'">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn
                      color="#5865f2"
                      variant="flat"
                      size="small"
                      class="text-none"
                      v-bind="activatorProps"
                      text="Start Review"
                    ></v-btn>
                  </template>
                  <template v-slot:default="{ isActive }">
                    <v-card style="max-height: 90vh; overflow-y: auto">
                      <v-card-title class="text-h6">
                        <span>Manager Appraisal</span>
                        <v-btn
                          v-if="$vuetify.display.mobile"
                          icon
                          @click="isActive.value = false"
                          style="position: absolute; right: 10px"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </v-card-title>
                      <v-card-text>
                        <v-form>
                          <v-row>
                            <v-col cols="12">
                              <v-label class="text-wrap"
                                >How do you think this employee performed in the past 12
                                months?</v-label
                              >
                              <v-rating
                                v-model="getReviewData(employee.employeeId).performanceRating"
                                color="yellow-darken-2"
                                hover
                                length="5"
                                size="24"
                                class="my-2"
                              ></v-rating>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-col cols="12">
                              <v-label class="text-wrap"
                                >How would you rate their potential?</v-label
                              >
                              <v-rating
                                v-model="getReviewData(employee.employeeId).potentialRating"
                                color="yellow-darken-2"
                                hover
                                length="5"
                                size="24"
                                class="my-2"
                              ></v-rating>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-col cols="12">
                              <v-label class="text-wrap"
                                >How would you rate their fit with the company culture?</v-label
                              >
                              <v-rating
                                v-model="getReviewData(employee.employeeId).cultureFitRating"
                                color="yellow-darken-2"
                                hover
                                length="5"
                                size="24"
                                class="my-2"
                              ></v-rating>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-col cols="12">
                              <v-label class="text-wrap"
                                >What are the biggest achievements they've had since their last
                                review?</v-label
                              >
                              <v-textarea
                                v-model="getReviewData(employee.employeeId).achievements"
                                rows="3"
                                variant="outlined"
                                class="my-2"
                              ></v-textarea>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-col cols="12">
                              <v-label class="text-wrap"
                                >Have you planned any special projects or goals for them for the
                                next 12 months?</v-label
                              >
                              <v-textarea
                                v-model="getReviewData(employee.employeeId).futureProjects"
                                rows="3"
                                variant="outlined"
                                class="my-2"
                              ></v-textarea>
                            </v-col>
                          </v-row>
                        </v-form>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text="Close" variant="text" @click="isActive.value = false"></v-btn>
                        <v-btn
                          color="primary"
                          text="Save"
                          variant="flat"
                          @click="
                            saveReview(employee);
                            isActive.value = false;
                          "
                        ></v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.v-card {
  min-height: 220px;
}
.v-card-text > div:not(:last-child) {
  margin-bottom: 8px;
}
@media (max-width: 600px) {
  .v-card {
    min-height: 200px;
  }
}
</style>
