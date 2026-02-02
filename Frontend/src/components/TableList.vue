<script>
import { mapState } from "vuex";
import { jsPDF } from "jspdf";

export default {
  name: "PayrollView",

  props: {
    payrollData: Array,
  },

  data() {
    return {
      dialog: false,
      selectedEmployee: null,
      headers: [
        { title: "Name", key: "name", sortable: true },
        { title: "Position", key: "position", sortable: true },
        { title: "Department", key: "department", sortable: true },
        { title: "Base Salary", key: "baseSalary", sortable: true },
        { title: "Final Salary", key: "finalSalary", sortable: true },
        { title: "Hourly Rate", key: "hourlyRate", sortable: true },
        { title: "Payslip", key: "actions", sortable: false, align: "center" },
      ],
      search: "",
      itemsPerPage: 10,
      currentPage: 1,
    };
  },

  computed: {
    ...mapState(["employees"]),

    itemsWithUniqueIds() {
      return (this.employees || []).map((employee) => {
        const payrollInfo =
          this.payrollData?.find((p) => p.employeeId === employee.employeeId) ||
          {};

        const hourlyRate = payrollInfo.hourlyRate || employee.salary / 160;
        const baseSalary = employee.salary || 0;
        const finalSalary = payrollInfo.finalSalary || baseSalary;
        const leaveDays = payrollInfo.leaveDeductions || 0;
        const leaveDeductionAmount = baseSalary - finalSalary;
        const hoursWorked = payrollInfo.hoursWorked || 0;

        return {
          ...employee,
          ...payrollInfo,
          uniqueId: employee.employeeId
            ? `emp-${employee.employeeId}`
            : `emp-${Math.random().toString(36).substr(2, 9)}`,
          baseSalary,
          hourlyRate,
          finalSalary,
          leaveDays,
          leaveDeductionAmount,
          hoursWorked,
        };
      });
    },

    totalPayroll() {
      return (this.payrollData || []).reduce(
        (sum, e) => sum + (e.finalSalary || 0),
        0
      );
    },

    employeesProcessed() {
      return (this.employees || []).length;
    },

    nextPayrollDate() {
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return nextMonth.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    },
  },

  methods: {
    generatePayslip(employee) {
      if (!employee) return;

      try {
        const doc = new jsPDF();

        //
        // HEADER
        //
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Your Company Name", 105, 15, { align: "center" });

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(
          "123 Company Address, City, Country",
          105,
          22,
          { align: "center" }
        );
        doc.text("Payroll Department", 105, 29, { align: "center" });

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("PAYSLIP", 105, 40, { align: "center" });

        doc.setLineWidth(0.5);
        doc.line(20, 45, 190, 45);

        //
        // EMPLOYEE INFO
        //
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        doc.text(`Employee ID: ${employee.employeeId || "N/A"}`, 20, 55);
        doc.text(`Name: ${employee.name}`, 20, 62);
        doc.text(`Position: ${employee.position}`, 20, 69);
        doc.text(`Department: ${employee.department}`, 20, 76);
        doc.text(
          `Pay Period: ${new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}`,
          20,
          83
        );

        //
        // EARNINGS BOX
        //
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Earnings", 20, 100);

        doc.setDrawColor(22, 78, 99);
        doc.setFillColor(240, 248, 255);
        doc.rect(20, 105, 80, 50, "FD");

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Description", 25, 112);
        doc.text("Amount", 95, 112, { align: "right" });
        doc.line(25, 114, 95, 114);

        doc.text("Base Salary", 25, 121);
        doc.text(
          `R${employee.baseSalary?.toLocaleString() || "0"}`,
          95,
          121,
          { align: "right" }
        );

        doc.text("Hourly Rate", 25, 128);
        doc.text(
          `R${employee.hourlyRate?.toLocaleString() || "0"}`,
          95,
          128,
          { align: "right" }
        );

        doc.text("Leave Days", 25, 135);
        doc.text(`${employee.leaveDays || 0} days`, 95, 135, {
          align: "right",
        });

        doc.line(25, 142, 95, 142);

        doc.setFont("helvetica", "bold");
        doc.text("Gross Pay", 25, 148);
        doc.text(
          `R${employee.baseSalary?.toLocaleString() || "0"}`,
          95,
          148,
          { align: "right" }
        );

        //
        // DEDUCTIONS BOX
        //
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Deductions", 110, 100);

        doc.setDrawColor(22, 78, 99);
        doc.setFillColor(240, 248, 255);
        doc.rect(110, 105, 80, 50, "FD");

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Description", 115, 112);
        doc.text("Amount", 185, 112, { align: "right" });
        doc.line(115, 114, 185, 114);

        doc.text("Leave Deductions", 115, 121);
        doc.text(
          `R${employee.leaveDeductionAmount?.toLocaleString() || "0"}`,
          185,
          121,
          { align: "right" }
        );

        doc.text(`(${employee.leaveDays || 0} days)`, 115, 128);

        doc.text("Tax", 115, 135);
        doc.text("R0", 185, 135, { align: "right" });

        doc.line(115, 142, 185, 142);

        doc.setFont("helvetica", "bold");
        doc.text("Total Deductions", 115, 148);
        doc.text(
          `R${employee.leaveDeductionAmount?.toLocaleString() || "0"}`,
          185,
          148,
          { align: "right" }
        );

        //
        // SALARY CALCULATION
        //
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Salary Calculation", 20, 165);

        doc.setFont("helvetica", "normal");
        doc.text(
          `Base Salary (R${employee.baseSalary?.toLocaleString() || "0"}) - ` +
            `Leave Deductions (R${
              employee.leaveDeductionAmount?.toLocaleString() || "0"
            } for ${employee.leaveDays || 0} days) = ` +
            `R${employee.finalSalary?.toLocaleString() || "0"}`,
          20,
          172,
          { maxWidth: 170 }
        );

        //
        // NET PAY BAR
        //
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setFillColor(22, 78, 99);
        doc.rect(20, 185, 170, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.text(
          `Net Pay: R${employee.finalSalary?.toLocaleString() || "0"}`,
          105,
          195,
          { align: "center" }
        );
        doc.setTextColor(0, 0, 0);

        //
        // FOOTER
        //
        const pageHeight = doc.internal.pageSize.height;

        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.text(
          "This is a computer-generated payslip and does not require a signature.",
          105,
          pageHeight - 30,
          { align: "center" }
        );
        doc.text("Thank you for your hard work!", 105, pageHeight - 20, {
          align: "center",
        });
        doc.text(
          "For inquiries, contact: payroll@yourcompany.com",
          105,
          pageHeight - 10,
          { align: "center" }
        );

        doc.save(
          `payslip_${employee.name.replace(/\s+/g, "_")}.pdf`
        );
      } catch (e) {
        console.error(e);
        alert("Failed to generate payslip");
      }
    },

    openPayslipModal(employee) {
      this.selectedEmployee = employee;
      this.dialog = true;
    },
  },
};
</script>


<template>
  <v-container fluid class="pa-4">
    <div class="text-h4 font-weight-bold mb-2">Payroll Management</div>
    <div class="text-subtitle-1 text-medium-emphasis mb-6">
      Manage employee compensation and benefits
    </div>
    
    <!-- Summary Cards -->
    <v-row no-gutters class="mb-6">
      <v-col cols="12" sm="4" class="pr-sm-2 mb-4">
        <v-card class="pa-4 d-flex align-center h-100">
          <v-avatar color="primary" size="48" class="mr-4">
            <v-icon>mdi-currency-usd</v-icon>
          </v-avatar>
          <div>
            <div class="text-caption">Total Payroll</div>
            <div class="text-h5 font-weight-bold">R{{ totalPayroll.toLocaleString() }}</div>
          </div>
          <v-spacer />
          <v-chip size="small" color="success" variant="tonal">Paid</v-chip>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4" class="px-sm-2 mb-4">
        <v-card class="pa-4 d-flex align-center h-100">
          <v-avatar color="primary" size="48" class="mr-4">
            <v-icon>mdi-account-multiple</v-icon>
          </v-avatar>
          <div>
            <div class="text-caption">Employees Processed</div>
            <div class="text-h5 font-weight-bold">{{ employeesProcessed }}</div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4" class="pl-sm-2 mb-4">
        <v-card class="pa-4 d-flex align-center h-100">
          <v-avatar color="primary" size="48" class="mr-4">
            <v-icon>mdi-calendar</v-icon>
          </v-avatar>
          <div>
            <div class="text-caption">Next Payroll</div>
            <div class="text-h5 font-weight-bold">{{ nextPayrollDate }}</div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4" class="pr-sm-2 mb-4">
        <v-card class="pa-4 d-flex align-center h-100">
          <v-avatar color="primary" size="48" class="mr-4">
            <v-icon>mdi-calculator</v-icon>
          </v-avatar>
          <div>
            <div class="text-caption">Salary Calculation</div>
            <div class="text-body-2">
              (Hourly Rate x Hours Worked) - Deductions
            </div></div>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Payroll Actions -->
    <div class="text-h6 font-weight-medium mb-4">Payroll Actions</div>
    <v-row justify="center" no-gutters class="mb-6">
      <v-col cols="12" md="10">
        <v-row justify="center" no-gutters>
          <v-col cols="6" md="3" class="pr-2 mb-4">
            <v-card
              class="pa-4 d-flex flex-column align-center mx-auto"
              style="height: 120px; border-radius: 8px; max-width: 200px"
              elevation="1"
            >
              <v-avatar color="primary" variant="tonal" size="40" class="mb-3">
                <v-icon>mdi-currency-usd</v-icon>
              </v-avatar>
              <div class="text-caption text-center">Process Payroll</div>
            </v-card>
          </v-col>
          <v-col cols="6" md="3" class="px-2 mb-4">
            <v-card
              class="pa-4 d-flex flex-column align-center mx-auto"
              style="height: 120px; border-radius: 8px; max-width: 200px"
              elevation="1"
            >
              <v-avatar color="primary" variant="tonal" size="40" class="mb-3">
                <v-icon>mdi-cog</v-icon>
              </v-avatar>
              <div class="text-caption text-center">Tax Settings</div>
            </v-card>
          </v-col>
          <v-col cols="6" md="3" class="pl-2 mb-4">
            <v-card
              class="pa-4 d-flex flex-column align-center mx-auto"
              style="height: 120px; border-radius: 8px; max-width: 200px"
              elevation="1"
            >
              <v-avatar color="primary" variant="tonal" size="40" class="mb-3">
                <v-icon>mdi-chart-bar</v-icon>
              </v-avatar>
              <div class="text-caption text-center">Analytics</div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    
    <!-- Employee Table -->
    <v-card elevation="1" rounded="lg">
      <div class="pa-4 pb-2">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search employees"
          hide-details
          clearable
          density="compact"
          variant="outlined"
        />
      </div>
      <v-data-table
        fixed-header
        height="600"
        :headers="headers"
        :items="itemsWithUniqueIds"
        :search="search"
        :items-per-page="itemsPerPage"
        item-key="uniqueId"
        density="comfortable"
        class="elevation-0"
        :footer-props="{
          'items-per-page-options': [10, 20, 30],
          'show-current-page': true,
          'show-first-last-page': true,
        }"
      >
        <template #item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="36" class="me-3" color="primary">
              <span class="text-white font-weight-bold">
                {{ item.name.charAt(0) }}
              </span>
            </v-avatar>
            <div class="font-weight-medium">{{ item.name }}</div>
          </div>
        </template>
        <template #item.department="{ item }">
          <v-chip size="small" color="blue" variant="flat">
            {{ item.department }}
          </v-chip>
        </template>
        <template #item.baseSalary="{ item }">
          R{{ item.baseSalary?.toLocaleString() || "0" }}
        </template>
        <template #item.finalSalary="{ item }">
          <span class="font-weight-bold">R{{ item.finalSalary?.toLocaleString() || "0" }}</span>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex justify-center gap-2">
            <v-btn
              size="small"
              color="primary"
              variant="flat"
              class="text-none"
              @click="generatePayslip(item)"
            >
              Download
            </v-btn>
            <v-btn
              size="small"
              color="primary"
              variant="outlined"
              class="text-none"
              @click="openPayslipModal(item)"
            >
              View
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
    
    <!-- Payslip Modal -->
    <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
      <v-card>
        <v-toolbar>
          <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
          <v-toolbar-title>Payslip for {{ selectedEmployee?.name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="generatePayslip(selectedEmployee)">
            Download PDF
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" md="6">
              <v-card class="pa-4 mb-4">
                <v-card-title class="text-h6">Employee Information</v-card-title>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>Employee ID</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedEmployee?.employeeId }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Name</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedEmployee?.name }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Position</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedEmployee?.position }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Department</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedEmployee?.department }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
              <v-card class="pa-4">
                <v-card-title class="text-h6">Work Summary</v-card-title>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>Hours Worked</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedEmployee?.hoursWorked || 0 }} hours</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Leave Days Taken</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedEmployee?.leaveDays || 0 }} days</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Leave Deduction Amount</v-list-item-title>
                    <v-list-item-subtitle>R{{ selectedEmployee?.leaveDeductionAmount?.toLocaleString() || "0" }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card class="pa-4">
                <v-card-title class="text-h6">Payroll Breakdown</v-card-title>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>Base Salary</v-list-item-title>
                    <v-list-item-subtitle class="text-h6">
                      R{{ selectedEmployee?.baseSalary?.toLocaleString() || "0" }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-2"></v-divider>
                  <v-list-item>
                    <v-list-item-title>Deductions</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title class="ml-4">Leave Deductions</v-list-item-title>
                    <v-list-item-subtitle class="text-error">
                      -R{{ selectedEmployee?.leaveDeductionAmount?.toLocaleString() || "0" }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title class="ml-4 text-caption">Leave Days</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ selectedEmployee?.leaveDays || 0 }} days
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-2"></v-divider>
                  <v-list-item>
                    <v-list-item-title class="font-weight-bold">Net Pay</v-list-item-title>
                    <v-list-item-subtitle class="text-h5 text-success font-weight-bold">
                      R{{ selectedEmployee?.finalSalary?.toLocaleString() || "0" }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-3"></v-divider>
                  <v-list-item>
                    <v-list-item-title>Calculation</v-list-item-title>
                    <v-list-item-subtitle>
                      R{{ selectedEmployee?.baseSalary?.toLocaleString() || "0" }} - 
                      R{{ selectedEmployee?.leaveDeductionAmount?.toLocaleString() || "0" }} 
                      ({{ selectedEmployee?.leaveDays || 0 }} days) = 
                      R{{ selectedEmployee?.finalSalary?.toLocaleString() || "0" }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.v-container {
  max-width: 100%;
}
.v-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
}
:deep(.v-data-table__tbody tr td) {
  padding-top: 12px;
  padding-bottom: 12px;
}
:deep(.v-data-table-footer) {
  padding: 8px 16px !important;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
:deep(.v-data-table__td--actions) {
  text-align: center;
}
.gap-2 {
  gap: 8px;
}
</style>