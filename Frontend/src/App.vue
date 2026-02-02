<script>
import NavBar from './components/NavBar.vue';
import LoginPage from './components/LoginPage.vue';
export default {
  name: 'App',
  components: {
    NavBar,
    LoginPage,
  },
  data() {
    return {
      isLoggedIn: false,
    };
  },
  provide() {
    return {
      setLoggedIn: (value) => {
        this.isLoggedIn = value;
      },
    };
  },
};

</script>

<template>
  <div v-if="isLoggedIn">
    <v-app>
    <NavBar>
      <router-view />
    </NavBar>
  </v-app>
  </div>
  <LoginPage v-else />
</template>


