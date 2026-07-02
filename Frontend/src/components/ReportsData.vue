<template>
  <v-container fluid class="pa-2 pa-sm-4">
    <v-row>
      <!-- Summary cards -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-3 pa-sm-4" elevation="2">
          <v-card-title>Total Employees</v-card-title>
          <v-card-text class="text-h4 font-weight-bold">
            {{ totalEmployees }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-3 pa-sm-4" elevation="2">
          <v-card-title>Total Hours Worked</v-card-title>
          <v-card-text class="text-h4 font-weight-bold">
            {{ totalHoursWorked }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-3 pa-sm-4" elevation="2">
          <v-card-title>Average Hours Worked</v-card-title>
          <v-card-text class="text-h4 font-weight-bold">
            {{ averageHoursWorked }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <!-- Attendance Chart -->
      <v-col cols="12" lg="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Weekly Attendance</v-card-title>
          <v-card-text style="height: 260px">
            <Bar
              v-if="weeklyAttendanceChartData.labels?.length"
              :data="weeklyAttendanceChartData"
              :options="chartOptions"
            />
            <p v-else class="text-center">No attendance data</p>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Payroll Chart -->
      <v-col cols="12" lg="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Hours vs Payroll</v-card-title>
          <v-card-text style="height: 260px">
            <Line
              v-if="payrollComparisonData.labels?.length"
              :data="payrollComparisonData"
              :options="dualAxisChartOptions"
            />
            <p v-else class="text-center">No payroll data</p>
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
    employees: { type: Array, default: () => [] },
    attendance: { type: Array, default: () => [] },
    payroll: { type: Array, default: () => [] },
  },

  components: { Bar, Line },

  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      dualAxisChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        scales: {
          y: { type: "linear", position: "left" },
          y1: {
            type: "linear",
            position: "right",
            grid: { drawOnChartArea: false },
          },
        },
      },
    };
  },

  computed: {
    totalEmployees() {
      return Array.isArray(this.employees) ? this.employees.length : 0;
    },

    totalHoursWorked() {
      if (!Array.isArray(this.payroll)) return 0;
      return this.payroll.reduce(
        (sum, e) => sum + Number(e.hoursWorked || 0),
        0
      );
    },

    averageHoursWorked() {
      const total = this.totalHoursWorked;
      return Array.isArray(this.employees) && this.employees.length
        ? (total / this.employees.length).toFixed(2)
        : 0;
    },

    weeklyAttendanceChartData() {
      if (!Array.isArray(this.attendance)) return { labels: [], datasets: [] };

      const days = {};
      this.attendance.forEach(emp => {
        emp.attendance?.forEach(rec => {
          if (!days[rec.date]) days[rec.date] = { Present: 0, Absent: 0 };
          if (rec.status === "Present" || rec.status === "Absent") {
            days[rec.date][rec.status]++;
          }
        });
      });

      const labels = Object.keys(days).sort();

      return {
        labels,
        datasets: [
          {
            label: "Present",
            backgroundColor: "#4e73df",
            borderColor: "#4e73df",
            data: labels.map(d => days[d].Present),
          },
          {
            label: "Absent",
            backgroundColor: "#e74a3b",
            borderColor: "#e74a3b",
            data: labels.map(d => days[d].Absent),
          },
        ],
      };
    },

    payrollComparisonData() {
      if (!Array.isArray(this.employees) || !Array.isArray(this.payroll))
        return { labels: [], datasets: [] };

      const labels = [];
      const hours = [];
      const salary = [];

      this.employees.forEach(emp => {
        const pay = this.payroll.find(p => p.employeeId === emp.employeeId);
        if (pay) {
          labels.push(emp.name);
          hours.push(Number(pay.hoursWorked || 0));
          salary.push(Number(pay.finalSalary || 0));
        }
      });

      return {
        labels,
        datasets: [
          {
            label: "Hours Worked",
            data: hours,
            borderColor: "#4e73df",
            backgroundColor: "rgba(78, 115, 223, 0.1)",
            tension: 0.4,
            fill: true,
            yAxisID: "y",
          },
          {
            label: "Final Payroll (R)",
            data: salary,
            borderColor: "#1cc88a",
            backgroundColor: "rgba(28, 200, 138, 0.1)",
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
