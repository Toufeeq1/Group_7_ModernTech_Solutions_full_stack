<script>
export default {
  name: "NavBar",

  data() {
    return {
      drawer: true,
      rail: false,
      railHover: false,
      elevation: 1,

      navItems: [
        { icon: "mdi-view-dashboard", title: "Dashboard", to: "/" },
        { icon: "mdi-account-group", title: "Employees", to: "/Employees" },
        { icon: "mdi-calendar-check", title: "Attendance", to: "Attendance" },
        { icon: "mdi-chart-line", title: "Performace", to: "/Performace" },
        { icon: "mdi-chart-bar", title: "Reports", to: "/Reports" },
        { icon: "mdi-cash", title: "Payroll", to: "/Payroll" },
        { icon: "mdi-calendar", title: "Leave", to: "Leave" },
        
      ],

      userMenuItems: [
        { icon: "mdi-account", title: "Profile" },
        { icon: "mdi-cog", title: "Settings" },
        { icon: "mdi-logout", title: "Logout" },
      ],
    }
  },

  computed: {
    isMobile() {
      return this.$vuetify.display.mobile
    },

    isTablet() {
      return this.$vuetify.display.tablet
    },

    sidebarWidth() {
      if (this.isMobile) return 256
      return this.rail ? 72 : 256
    },

    railWidth() {
      return 72
    },

    searchWidth() {
      if (this.isMobile) return "160px"
      if (this.isTablet) return "200px"
      return "300px"
    },

    mainContentClasses() {
      return {
        "main-content-collapsed": this.rail && !this.isMobile,
        "main-content-expanded": !this.rail && !this.isMobile,
        "main-content-mobile": this.isMobile,
      }
    },

    pageContentClasses() {
      return {
        "page-content-with-sidebar": !this.isMobile,
        "page-content-mobile": this.isMobile,
      }
    },
  },

  watch: {
    isMobile: {
      immediate: true,
      handler(val) {
        if (val) {
          this.drawer = false
          this.rail = false
          this.elevation = 2
        } else {
          this.drawer = true
          this.elevation = 1
        }
      },
    },

    $route() {
      if (this.isMobile) {
        this.drawer = false
      }
    },
  },

  methods: {
    isActive(route) {
      return this.$route.path === route
    },

    toggleRail() {
      if (this.isMobile) this.drawer = !this.drawer
      else this.rail = !this.rail
    },

    onSidebarHover() {
      if (this.rail && !this.isMobile) this.railHover = true
    },

    onSidebarLeave() {
      this.railHover = false
    },

    onRailHover() {
      if (this.rail && !this.isMobile) this.railHover = true
    },

    onRailLeave() {
      this.railHover = false
    },
  },
}
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="isMobile ? false : rail"
    :permanent="!isMobile"
    :temporary="isMobile"
    :width="sidebarWidth"
    :rail-width="railWidth"
    app
    class="sidebar"
    @mouseenter="onSidebarHover"
    @mouseleave="onSidebarLeave"
  >
    <div class="sidebar-inner">
      <div class="sidebar-header" v-if="!rail || isMobile">
        <div class="logo-section">
          <h2 class="logo">HRFlow</h2>
        </div>
      </div>

      <v-list class="sidebar-nav">
        <v-list-item
          v-for="item in navItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="rail && !isMobile ? '' : item.title"
          :to="item.to"
          :active="isActive(item.to)"
          class="nav-item"
          :class="{ 'nav-item-active': isActive(item.to) }"
        >
          <template #prepend>
            <v-icon :class="{ 'active-icon': isActive(item.to) }">
              {{ item.icon }}
            </v-icon>
          </template>

          <v-tooltip
            v-if="rail && !isMobile"
            location="right"
            activator="parent"
          >
            {{ item.title }}
          </v-tooltip>
        </v-list-item>
      </v-list>

      <div class="sidebar-footer" v-if="!rail || isMobile">
        <v-list>
          <v-list-item prepend-icon="mdi-cog" title="Settings" />
          <v-list-item prepend-icon="mdi-logout" title="Logout" />
        </v-list>
      </div>
    </div>

    <div
      v-if="!isMobile"
      class="sidebar-rail-hover"
      @click="toggleRail"
      @mouseenter="onRailHover"
      @mouseleave="onRailLeave"
    ></div>
  </v-navigation-drawer>

  <v-app-bar
    :elevation="elevation"
    class="app-bar"
    :class="{ 'app-bar-mobile': isMobile }"
    app
  >
    <v-app-bar-nav-icon
      v-if="isMobile"
      @click="drawer = !drawer"
    />

    <v-btn
      v-else
      icon
      variant="text"
      @click="toggleRail"
      class="desktop-toggle"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <v-toolbar-title class="toolbar-title">
      HRFlow
    </v-toolbar-title>

    <v-spacer />

    <v-text-field
      density="compact"
      variant="outlined"
      placeholder="Search employees, tasks..."
      prepend-inner-icon="mdi-magnify"
      single-line
      hide-details
      class="search-field"
      :style="{ width: searchWidth }"
    />

    <div class="action-buttons">
      <v-btn icon class="action-btn">
        <v-icon>mdi-cog</v-icon>
      </v-btn>

      <v-menu>
        <template #activator="{ props }">
          <v-btn icon v-bind="props" class="action-btn user-menu-btn">
            <v-avatar size="32" color="primary">
              <span class="avatar-text">JD</span>
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="item in userMenuItems"
            :key="item.title"
            :prepend-icon="item.icon"
            :title="item.title"
          />
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>

  <v-main class="main-content" :class="mainContentClasses">
    <div class="page-content" :class="pageContentClasses">
      <slot />
    </div>
  </v-main>
</template>


<style scoped>
.sidebar {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-x: hidden;
}
.sidebar-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
}
.sidebar-header {
  padding: 16px 16px 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 8px;
}
.logo-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: rgb(var(--v-theme-primary));
  transition: opacity 0.3s ease;
}
.toggle-btn {
  transform: rotate(0deg);
  transition: transform 0.3s ease;
}
.sidebar-collapsed .toggle-btn {
  transform: rotate(180deg);
}
.sidebar-nav {
  flex: 1;
  padding: 0 8px;
}
.nav-item {
  border-radius: 8px;
  margin: 2px 0;
  transition: all 0.2s ease;
  min-height: 44px;
}
.nav-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
}
.nav-item-active {
  background-color: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}
.nav-item-active .v-list-item-title {
  font-weight: 600;
}
.active-icon {
  color: rgb(var(--v-theme-primary)) !important;
}
.sidebar-footer {
  padding: 8px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  margin-top: auto;
}
.sidebar-rail-hover {
  position: absolute;
  top: 0;
  right: -8px;
  width: 16px;
  height: 100%;
  cursor: pointer;
  z-index: 2;
  transition: background-color 0.2s ease;
}
.main-content {
  background-color: #f8fafc;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
}
.main-content-collapsed {
  margin-left: 20px;
  margin-right: 20px;
}
.main-content-expanded {
  margin-left: 20px;
}
.app-bar {
  background-color: white !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
}
.app-bar-mobile {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}
.toolbar-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-left: 8px;
}
.search-field {
  max-width: 300px;
}
.action-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}
.action-btn {
  position: relative;
}
.user-menu-btn {
  margin-left: 8px;
}
.avatar-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}
.page-content {
  padding-top: 24px;
  padding-bottom: 24px;
  min-height: calc(100vh - 64px);
}
.page-content-with-sidebar {
  transition: padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-content-mobile {
  padding: 16px;
}
@media (max-width: 960px) {
  .main-content {
    margin-left: 0 !important;
  }
  .page-content {
    padding: 16px;
  }
  .sidebar {
    z-index: 1000;
  }
  .search-field {
    max-width: 160px;
  }
  .toolbar-title {
    font-size: 1.125rem;
  }
}
@media (min-width: 961px) and (max-width: 1264px) {
  .search-field {
    max-width: 200px;
  }
}
</style>
