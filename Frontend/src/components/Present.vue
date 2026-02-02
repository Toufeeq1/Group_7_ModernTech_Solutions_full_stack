<template>
  <div>
    <h2>Daily Attendance Overview</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Present Employees</th>
          <th>Absent Employees</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="day in attendanceByDate" :key="day.date">
          <td class="date-col" contenteditable="true">{{ day.date }}</td>
          <td class="editable" contenteditable="true">{{ day.present.join(", ") }}</td>
          <td class="editable" contenteditable="true">{{ day.absent.join(", ") }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Attendance",
  props: {
    attendanceData: {
      type: Array,
      required: true,
    },
  },
  computed: {
    // Extract unique dates from attendanceData
    dates() {
      const dates = new Set();
      this.attendanceData.forEach(emp => {
        emp.attendance.forEach(a => dates.add(a.date));
      });
      return Array.from(dates).sort();
    },
    attendanceByDate() {
      return this.dates.map(date => {
        const present = this.attendanceData.filter(emp => {
          const record = emp.attendance.find(a => a.date === date);
          return record && record.status === "Present";
        }).map(emp => emp.name);
        const absent = this.attendanceData.filter(emp => {
          const record = emp.attendance.find(a => a.date === date);
          return record && record.status === "Absent";
        }).map(emp => emp.name);
        return { date, present, absent };
      });
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  border: 2px solid #444;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  border: 1px solid #444;
}

th > * {
  background-color: #f2f2f2;
  display: inline;
}
.date-col {
  white-space: nowrap !important;
  cursor: text;
}

.editable {
  cursor: text;
  background: #fafafa;
}
</style>
