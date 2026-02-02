<script>
  export default {
    name: 'LoginPage',
    inject: ['setLoggedIn'],
    data() {
      return {
        email: '',
        password: '',
        loading: false,
        form: false,
      };
    },
    methods: {
      required(value) {
        return !!value || 'Required.';
      },
      onSubmit() {
        // Hardcoded credentials
        const validEmail = 'admin@example.com';
        const validPassword = 'password123';

        if (this.email === validEmail && this.password === validPassword) {
          this.loading = true;
          // Simulate an API call
          setTimeout(() => {
            this.loading = false;
            this.setLoggedIn(true);
            this.$router.push('/');
            alert(`Logged in with email: ${this.email}`);
          }, 2000);
        } else {
          alert('Invalid email or password. Try admin@example.com / password123');
        }
      },
    },
  };
</script>
<template>
   <v-sheet class="bg-deep-purple pa-12" rounded>
    <v-card class="mx-auto px-6 py-8" max-width="344">
      <v-form
        v-model="form"
        @submit.prevent="onSubmit"
      >
        <v-text-field
          v-model="email"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          label="Email"
          clearable
        ></v-text-field>

        <v-text-field
          v-model="password"
          :readonly="loading"
          :rules="[required]"
          label="Password"
          placeholder="Enter your password"
          clearable
        ></v-text-field>

        <br>

        <v-btn
          :disabled="!form"
          :loading="loading"
          color="success"
          size="large"
          type="submit"
          variant="elevated"
          block
        >
          Sign In
        </v-btn>
      </v-form>
    </v-card>
  </v-sheet> 
</template>
<style></style>