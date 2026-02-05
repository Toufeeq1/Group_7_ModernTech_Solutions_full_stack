<script>
export default {
  name: "HomePage",
  props: {
    employees: Array,
    payroll: Array,
    attendance: Array,
  },
  data() {
    return {
      selectedDate: new Date(),
    };
  },
  computed: {
    timeOfDay() {
      const hour = new Date().getHours();
      if (hour < 12) return "morning";
      if (hour < 18) return "afternoon";
      return "evening";
    },
    totalEmployees() {
      return this.employees?.length || 0;
    },
    presentToday() {
      const today = new Date().toISOString().split("T")[0];
      let count = 0;
      this.attendance?.forEach((emp) => {
        emp.attendance?.forEach((record) => {
          if (record.date === today && record.status === "Present") {
            count++;
          }
        });
      });
      return count;
    },
    attendanceRate() {
      if (!this.totalEmployees || !this.presentToday) return 0;
      return ((this.presentToday / this.totalEmployees) * 100).toFixed(1);
    },
    totalHoursWorked() {
      return this.payroll?.reduce((sum, emp) => sum + (emp.hoursWorked || 0), 0) || 0;
    },
    totalPayroll() {
      const total = this.payroll?.reduce((sum, emp) => sum + (emp.finalSalary || 0), 0) || 0;
      return (total / 1000).toFixed(1);
    },
    leaveDates() {
      const dates = [];
      this.attendance?.forEach((emp) => {
        emp.leaveRequests?.forEach((request) => {
          if (request.status === "Approved") {
            dates.push(request.date);
          }
        });
      });
      return dates;
    },
    employeesOnLeaveForDate() {
      const dateStr = this.formatDateToISO(this.selectedDate);
      const onLeave = [];

      this.attendance?.forEach((emp) => {
        emp.leaveRequests?.forEach((request) => {
          if (request.date === dateStr && request.status === "Approved") {
            const employee = this.employees?.find((e) => e.employeeId === emp.employeeId);
            if (employee) {
              onLeave.push({
                employeeId: emp.employeeId,
                name: employee.name,
              });
            }
          }
        });
      });

      return onLeave;
    },
    departmentStats() {
      const depts = {};
      const colors = ["primary", "success", "warning", "info", "error", "purple", "teal", "indigo"];

      this.employees?.forEach((emp) => {
        depts[emp.department] = (depts[emp.department] || 0) + 1;
      });

      return Object.entries(depts).map(([name, count], idx) => ({
        name,
        count,
        color: colors[idx % colors.length],
      }));
    },
    pendingLeaves() {
      const pending = [];

      this.attendance?.forEach((emp) => {
        const employee = this.employees?.find((e) => e.employeeId === emp.employeeId);
        emp.leaveRequests?.forEach((request) => {
          if (request.status === "Pending") {
            pending.push({
              employeeId: emp.employeeId,
              name: employee?.name || "Unknown",
              image: employee?.image || "",
              reason: request.reason,
              date: request.date,
            });
          }
        });
      });

      return pending;
    },
    employeeOverview() {
      return (
        this.employees?.slice(0, 10).map((emp) => {
          const payrollInfo = this.payroll?.find((p) => p.employeeId === emp.employeeId);
          const attendanceInfo = this.attendance?.find((a) => a.employeeId === emp.employeeId);

          let recentStatus = "N/A";
          if (attendanceInfo?.attendance?.length > 0) {
            const sortedAttendance = [...attendanceInfo.attendance].sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            );
            recentStatus = sortedAttendance[0].status;
          }

          return {
            employeeId: emp.employeeId,
            name: emp.name,
            image: emp.image,
            department: emp.department,
            hoursWorked: payrollInfo?.hoursWorked || 0,
            recentStatus,
          };
        }) || []
      );
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
    formatDateToISO(date) {
      if (!date) return "";
      if (typeof date === "string") return date;
      const d = new Date(date);
      return d.toISOString().split("T")[0];
    },
  },
  mounted() {
  console.log('Static employees:', this.employees)
  console.log('API employees:', this.employeesnew)
}
};
</script>

<template>
  <v-container fluid class="pa-4">
    <v-card class="mb-6 gradient-header" elevation="4">
      <v-card-text class="pa-6">
        <h1 class="text-h4 text-white mb-2">Good {{ timeOfDay }}! 👋</h1>
        <p class="text-subtitle-1 text-white mb-4">Here's what's happening with your team today.</p>
        <div class="d-flex flex-wrap gap-3">
          <v-chip color="white" variant="elevated">
            <v-icon start>mdi-account-group</v-icon>
            {{ totalEmployees }} Total Employees
          </v-chip>
          <v-chip color="white" variant="elevated">
            <v-icon start>mdi-account-check</v-icon>
            {{ presentToday }} Active Today
          </v-chip>
        </div>
      </v-card-text>
    </v-card>

    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="4">
        <v-card elevation="2" class="pa-4">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-subtitle-2 text-grey-darken-1">Total Employees</span>
            <v-icon color="primary">mdi-account-group</v-icon>
          </div>
          <h2 class="text-h3 font-weight-bold">{{ totalEmployees }}</h2>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card elevation="2" class="pa-4">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-subtitle-2 text-grey-darken-1">Total Hours Worked</span>
            <v-icon color="success">mdi-clock-check</v-icon>
          </div>
          <h2 class="text-h3 font-weight-bold">{{ totalHoursWorked }}</h2>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card elevation="2" class="pa-4">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-subtitle-2 text-grey-darken-1">Monthly Payroll</span>
            <v-icon color="warning">mdi-currency-usd</v-icon>
          </div>
          <h2 class="text-h3 font-weight-bold">${{ totalPayroll }}K</h2>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6" lg="5">
        <v-card elevation="2" height="100%">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-calendar-month</v-icon>
            Employee Leave Calendar
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-card variant="outlined" class="mb-3 pa-3">
              <div class="text-subtitle-2 font-weight-bold mb-2">Legend</div>
              <div class="d-flex flex-wrap gap-2">
                <v-chip size="small" color="warning" variant="flat">
                  <v-icon start size="small">mdi-circle</v-icon>
                  On Leave
                </v-chip>
              </div>
            </v-card>

            <v-date-picker
              v-model="selectedDate"
              :events="leaveDates"
              event-color="warning"
              show-adjacent-months
              width="100%"
            ></v-date-picker>
            <v-divider class="my-3"></v-divider>
            <div v-if="employeesOnLeaveForDate.length > 0">
              <p class="text-subtitle-2 mb-2">On leave {{ formatDate(selectedDate) }}:</p>
              <v-chip
                v-for="emp in employeesOnLeaveForDate"
                :key="emp.employeeId"
                size="small"
                class="mr-2 mb-2"
                color="warning"
              >
                {{ emp.name }}
              </v-chip>
            </div>
            <p v-else class="text-caption text-grey">No one on leave this date</p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <v-card elevation="2" height="100%">
          <v-card-title>Department Distribution</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div v-for="dept in departmentStats" :key="dept.name" class="mb-4">
              <div class="d-flex justify-space-between mb-1">
                <span class="text-body-2">{{ dept.name }}</span>
                <span class="text-body-2 font-weight-bold">{{ dept.count }}</span>
              </div>
              <v-progress-linear
                :model-value="(dept.count / totalEmployees) * 100"
                :color="dept.color"
                height="10"
                rounded
              ></v-progress-linear>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="3">
        <v-card elevation="2" height="100%">
          <v-card-title>Pending Leave Requests</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-list v-if="pendingLeaves.length > 0">
              <v-list-item
                v-for="request in pendingLeaves"
                :key="`${request.employeeId}-${request.date}`"
              >
                <template v-slot:prepend>
                  <v-avatar size="40">
                    <v-img :src="request.image"></v-img>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ request.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ request.reason }}</v-list-item-subtitle>
                <v-list-item-subtitle class="text-caption">{{ request.date }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <div v-else class="pa-4 text-center text-grey">No pending leave requests</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>Recent Attendance Overview</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Hours Worked</th>
                  <th>Recent Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="emp in employeeOverview" :key="emp.employeeId">
                  <td>
                    <div class="d-flex align-center">
                      <v-avatar size="32" class="mr-2">
                        <v-img :src="emp.image"></v-img>
                      </v-avatar>
                      {{ emp.name }}
                    </div>
                  </td>
                  <td>{{ emp.department }}</td>
                  <td>{{ emp.hoursWorked }} hrs</td>
                  <td>
                    <v-chip
                      :color="emp.recentStatus === 'Present' ? 'success' : 'error'"
                      size="small"
                    >
                      {{ emp.recentStatus }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.gradient-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gap-3 {
  gap: 12px;
}

.gap-2 {
  gap: 8px;
}
</style>
