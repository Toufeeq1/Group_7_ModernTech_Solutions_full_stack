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
      :items="formattedLeaveRequests"
      class="elevation-1"
      :items-per-page="5"
    >
      <template v-slot:item.actions="{ item }">
        <div class="d-flex align-center">

          <v-chip
            small
            :color="getRequestStatusColor(item.status)"
            dark
            class="mr-2"
          >
            {{ item.status }}
          </v-chip>

          <template v-if="item.status === 'Pending'">
            <v-btn
              x-small
              color="success"
              class="mr-1"
              @click="approveRequest(item)"
            >
              Approve
            </v-btn>

            <v-btn
              x-small
              color="error"
              @click="rejectRequest(item)"
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
  props: {
    attendanceData: {
      type: Array,
      default: () => []
    },
    leaveRequests: {
      type: Array,
      default: () => []
    },
    leaveBalance: {
      type: Array,
      default: () => []
    },
    employeesSimple: {
      type: Array,
      default: () => []
    }
  },

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
        { text: "Status", value: "status" },
        { text: "Actions", value: "actions", sortable: false }
      ],

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
      // Use API data if available, otherwise use attendanceData
      if (this.employeesSimple && this.employeesSimple.length > 0) {
        return this.employeesSimple.map(e => e.name);
      }
      return this.attendanceData?.map(e => e.name) || [];
    },

    formattedLeaveRequests() {
      // Use API data if available
      if (this.leaveRequests && this.leaveRequests.length > 0) {
        return this.leaveRequests.map(req => ({
          name: req.employeeName,
          date: req.date,
          reason: req.reason,
          status: req.status,
          leaveId: req.leaveId,
          employeeId: req.employeeId,
          image: req.employeeImage
        }));
      }
      
      // Fallback to old format from attendanceData
      return this.attendanceData?.flatMap(employee =>
        employee.leaveRequests?.map(req => ({
          name: employee.name,
          date: req.date,
          reason: req.reason,
          status: req.status,
          _requestRef: req
        }))
      ) || [];
    }
  },

  methods: {
    getUsedLeaveDays(type) {
      // Use API data if available
      if (this.leaveBalance && this.leaveBalance.length > 0) {
        const balance = this.leaveBalance.find(b => b.leaveType === type);
        return balance?.usedDays || 0;
      }
      
      // Fallback to calculating from attendanceData
      return this.attendanceData?.flatMap(employee =>
        employee.leaveRequests?.filter(
          request => request.reason === type && request.status === "Approved"
        ) || []
      ).length || 0;
    },

    getRequestStatusColor(status) {
      if (status === "Pending") return "orange";
      if (status === "Approved") return "green";
      if (status === "Denied") return "red";
      return "gray";
    },

    async approveRequest(item) {
      // If we have leaveId (API data), use the store action
      if (item.leaveId) {
        try {
          await this.$store.dispatch('updateLeaveStatus', {
            leaveId: item.leaveId,
            status: 'Approved'
          });
          alert('Leave request approved!');
        } catch (error) {
          console.error('Failed to approve request:', error);
          alert('Failed to approve request');
        }
      } else {
        // Old method for JSON data
        item._requestRef.status = "Approved";
      }
    },

    async rejectRequest(item) {
      // If we have leaveId (API data), use the store action
      if (item.leaveId) {
        try {
          await this.$store.dispatch('updateLeaveStatus', {
            leaveId: item.leaveId,
            status: 'Denied'
          });
          alert('Leave request denied!');
        } catch (error) {
          console.error('Failed to deny request:', error);
          alert('Failed to deny request');
        }
      } else {
        // Old method for JSON data
        item._requestRef.status = "Denied";
      }
    },

    async submitLeave() {
      // Find employee from API data
      const employee = this.employeesSimple?.find(
        e => e.name === this.newLeave.employee
      );

      if (!employee) {
        alert("Employee not found");
        return;
      }

      try {
        await this.$store.dispatch('createLeaveRequest', {
          employeeId: employee.employeeId,
          startDate: this.newLeave.startDate,
          endDate: this.newLeave.endDate,
          reason: this.newLeave.type
        });

        // Reset form
        this.newLeave = {
          employee: "",
          type: "",
          startDate: "",
          endDate: ""
        };

        alert("Leave booked successfully!");
      } catch (error) {
        console.error('Failed to submit leave:', error);
        alert("Failed to submit leave request");
      }
    }
  }
};
</script>