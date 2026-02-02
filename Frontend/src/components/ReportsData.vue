<template>
  <v-container fluid class="pa-2 pa-sm-4">
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-3 pa-sm-4" elevation="2">
          <v-card-title class="text-subtitle-1 text-sm-h6 pa-2">Total Employees</v-card-title>
          <v-card-text class="text-h5 text-sm-h4 font-weight-bold pa-2">{{
            totalEmployees
          }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-3 pa-sm-4" elevation="2">
          <v-card-title class="text-subtitle-1 text-sm-h6 pa-2">Total Hours Worked</v-card-title>
          <v-card-text class="text-h5 text-sm-h4 font-weight-bold pa-2">{{
            totalHoursWorked
          }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-3 pa-sm-4" elevation="2">
          <v-card-title class="text-subtitle-1 text-sm-h6 pa-2">Average Hours Worked</v-card-title>
          <v-card-text class="text-h5 text-sm-h4 font-weight-bold pa-2">{{
            averageHoursWorked
          }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts Row -->
    <v-row class="mt-2 mt-sm-6">
      <v-col cols="12" lg="6">
        <v-card class="pa-3 pa-sm-4" elevation="2">
          <v-card-title class="text-subtitle-1 text-sm-h6 pa-2">Weekly Attendance</v-card-title>
          <v-card-text style="height: 250px; position: relative" class="pa-2">
            <Bar
              v-if="weeklyAttendanceChartData.labels && weeklyAttendanceChartData.labels.length"
              :data="weeklyAttendanceChartData"
              :options="chartOptions"
            />
            <p v-else class="text-center text-body-2">No attendance data available.</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="6">
        <v-card class="pa-3 pa-sm-4" elevation="2">
          <v-card-title class="text-subtitle-1 text-sm-h6 pa-2"
            >Hours Worked vs Final Payroll</v-card-title
          >
          <v-card-text style="height: 250px; position: relative" class="pa-2">
            <Line
              v-if="payrollComparisonData.labels && payrollComparisonData.labels.length"
              :data="payrollComparisonData"
              :options="dualAxisChartOptions"
            />
            <p v-else class="text-center text-body-2">No payroll data available.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Bar, Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler
);

export default {
  name: "ReportsData",
  props: {
    employees: Array,
    attendance: Array,
    payroll: Array,
  },
  components: {
    Bar,
    // eslint-disable-next-line vue/no-reserved-component-names
    Line,
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              font: {
                size: window.innerWidth < 600 ? 10 : 12,
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: window.innerWidth < 600 ? 9 : 11,
              },
            },
          },
          y: {
            ticks: {
              font: {
                size: window.innerWidth < 600 ? 9 : 11,
              },
            },
          },
        },
      },
      dualAxisChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            labels: {
              font: {
                size: window.innerWidth < 600 ? 10 : 12,
              },
            },
          },
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              display: window.innerWidth >= 600,
              text: "Hours",
              font: {
                size: window.innerWidth < 600 ? 10 : 12,
              },
            },
            ticks: {
              font: {
                size: window.innerWidth < 600 ? 9 : 11,
              },
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            title: {
              display: window.innerWidth >= 600,
              text: "Payroll (R)",
              font: {
                size: window.innerWidth < 600 ? 10 : 12,
              },
            },
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              font: {
                size: window.innerWidth < 600 ? 9 : 11,
              },
            },
          },
        },
      },
    };
  },
  computed: {
    totalEmployees() {
      return this.employees.length;
    },
    presentToday() {
      const today = new Date().toISOString().split("T")[0];
      let presentCount = 0;
      this.attendance.forEach((employee) => {
        employee.attendance.forEach((record) => {
          if (record.date === today && record.status === "Present") {
            presentCount++;
          }
        });
      });
      return presentCount;
    },
    absentToday() {
      const today = new Date().toISOString().split("T")[0];
      let absentCount = 0;
      this.attendance.forEach((employee) => {
        employee.attendance.forEach((record) => {
          if (record.date === today && record.status === "Absent") {
            absentCount++;
          }
        });
      });
      return absentCount;
    },
    totalHoursWorked() {
      return this.payroll.reduce((sum, employee) => sum + (employee.hoursWorked || 0), 0);
    },
    averageHoursWorked() {
      const total = this.totalHoursWorked;
      return this.employees.length > 0 ? (total / this.employees.length).toFixed(2) : 0;
    },
    weeklyAttendanceChartData() {

      const allDates = new Set();
      this.attendance.forEach((employee) => {
        employee.attendance.forEach((record) => {
          allDates.add(record.date);
        });
      });

      const sortedDates = Array.from(allDates).sort();

      const byDay = {};
      sortedDates.forEach((date) => {
        byDay[date] = { Present: 0, Absent: 0 };
      });

      this.attendance.forEach((employee) => {
        employee.attendance.forEach((record) => {
          if (byDay[record.date]) {
            byDay[record.date][record.status]++;
          }
        });
      });

      return {
        labels: sortedDates,
        datasets: [
          {
            label: "Present",
            backgroundColor: "#4e73df",
            data: sortedDates.map((date) => byDay[date].Present),
          },
          {
            label: "Absent",
            backgroundColor: "#e74a3b",
            data: sortedDates.map((date) => byDay[date].Absent),
          },
        ],
      };
    },
    payrollComparisonData() {
    
      const employeeNames = [];
      const hoursWorked = [];
      const finalSalaries = [];

      this.employees.forEach((employee) => {
        const payrollInfo = this.payroll.find((p) => p.employeeId === employee.employeeId);
        if (payrollInfo) {
          employeeNames.push(employee.name);
          hoursWorked.push(payrollInfo.hoursWorked);
          finalSalaries.push(payrollInfo.finalSalary);
        }
      });

      return {
        labels: employeeNames,
        datasets: [
          {
            label: "Hours Worked",
            borderColor: "#4e73df",
            backgroundColor: "rgba(78, 115, 223, 0.1)",
            data: hoursWorked,
            tension: 0.4,
            fill: true,
            yAxisID: "y",
          },
          {
            label: "Final Payroll (R)",
            borderColor: "#1cc88a",
            backgroundColor: "rgba(28, 200, 138, 0.1)",
            data: finalSalaries,
            tension: 0.4,
            fill: true,
            yAxisID: "y1",
          },
        ],
      };
    },
  },
};
</script>
