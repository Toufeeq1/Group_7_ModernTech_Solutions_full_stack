<template>
  <v-container class="pa-2">

    <h2 class="mb-4 text-h5 text-sm-h4">Leave Balance</h2>
    <v-row dense>
      <v-col
        v-for="(leaveType, index) in leaveTypes"
        :key="index"
        cols="12"
        sm="6"
      >
        <v-card class="pa-3" outlined>
          <v-card-title class="d-flex justify-space-between align-center pa-2">
            <div>
              <v-icon large>{{ leaveType.icon }}</v-icon>
              <span class="ml-2 text-subtitle-1">{{ leaveType.type }}</span>
            </div>
          </v-card-title>

          <v-card-text>
            <div class="d-flex justify-space-between text-caption">
              <span>Used</span>
              <span>{{ getUsedLeaveDays(leaveType.type) }} days</span>
            </div>

            <v-progress-linear
              :value="(getUsedLeaveDays(leaveType.type) / 10) * 100"
              height="8"
              class="my-2"
            />

            <div class="d-flex justify-space-between text-caption">
              <span>{{ 10 - getUsedLeaveDays(leaveType.type) }} days remaining</span>
              <span>{{ getUsedLeaveDays(leaveType.type) }}/10</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Leave Application Form -->
    <h2 class="my-4 text-h5 text-sm-h4">Book Leave (HR Only)</h2>

    <v-card class="pa-4 mb-6" outlined>
      <v-row>
        <v-col cols="12" sm="6">
          <v-select
            v-model="newLeave.employee"
            :items="employeeNames"
            label="Select Employee"
            outlined
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-select
            v-model="newLeave.type"
            :items="leaveTypes.map(t => t.type)"
            label="Leave Type"
            outlined
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="newLeave.startDate"
            type="date"
            label="Start Date"
            outlined
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="newLeave.endDate"
            type="date"
            label="End Date"
            outlined
          />
        </v-col>

        <v-col cols="12">
          <v-btn color="primary" block @click="submitLeave">
            Submit Leave
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Leave Requests Table -->
    <h2 class="my-4 text-h5 text-sm-h4">Leave Requests</h2>

    <v-data-table
      :headers="leaveRequestHeaders"
      :items="leaveRequests"
      class="elevation-1"
      :items-per-page="5"
    >
      <template v-slot:item.actions="{ item }">
        <div class="d-flex align-center">

          <v-chip
            small
            :color="getRequestStatusColor(item._requestRef.status)"
            dark
            class="mr-2"
          >
            {{ item._requestRef.status }}
          </v-chip>

          <template v-if="item._requestRef.status === 'Pending'">
            <v-btn
              x-small
              color="success"
              class="mr-1"
              @click="approveRequest(item._requestRef)"
            >
              Approve
            </v-btn>

            <v-btn
              x-small
              color="error"
              @click="rejectRequest(item._requestRef)"
            >
              Reject
            </v-btn>
          </template>

        </div>
      </template>
    </v-data-table>

  </v-container>
</template>

<script>
export default {
  props: ["attendanceData"],

  data() {
    return {
      leaveTypes: [
        { type: "Sick", icon: "mdi-hospital" },
        { type: "Annual", icon: "mdi-beach" },
        { type: "Time-off", icon: "mdi-account-group" },
      ],

      leaveRequestHeaders: [
        { text: "Employee", value: "name" },
        { text: "Date", value: "date" },
        { text: "Reason", value: "reason" },
        { text: "Status", value: "_requestRef.status" },
        { text: "Actions", value: "actions", sortable: false }
      ],

      // ⭐ Leave Application >>> FIXED
      newLeave: {
        employee: "",
        type: "",
        startDate: "",
        endDate: ""
      }
    };
  },

  computed: {
    employeeNames() {
      return this.attendanceData.map(e => e.name);
    },

    leaveRequests() {
      return this.attendanceData.flatMap(employee =>
        employee.leaveRequests.map(req => ({
          name: employee.name,
          date: req.date,
          reason: req.reason,
          _requestRef: req
        }))
      );
    }
  },

  methods: {
    getUsedLeaveDays(type) {
      return this.attendanceData.flatMap(employee =>
        employee.leaveRequests.filter(
          request => request.reason === type && request.status === "Approved"
        )
      ).length;
    },

    getRequestStatusColor(status) {
      if (status === "Pending") return "orange";
      if (status === "Approved") return "green";
      if (status === "Denied") return "red";
      return "gray";
    },

    approveRequest(request) {
      request.status = "Approved";
    },

    rejectRequest(request) {
      request.status = "Denied";
    },

    // ⭐ Working Leave Submission
    submitLeave() {
      const employee = this.attendanceData.find(
        e => e.name === this.newLeave.employee
      );

      if (!employee) {
        alert("Employee not found");
        return;
      }

      employee.leaveRequests.push({
        date: `${this.newLeave.startDate} → ${this.newLeave.endDate}`,
        reason: this.newLeave.type,
        status: "Pending"
      });

      this.newLeave = {
        employee: "",
        type: "",
        startDate: "",
        endDate: ""
      };

      alert("Leave booked successfully!");
    }
  }
};
</script>
