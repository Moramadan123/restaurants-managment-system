<template>
  <div class="container">
    <Navbar />
    <form @submit.prevent="updateProfile">
      <div class="form-container">
        <h1>Profile Information</h1>
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            type="text"
            class="form-control"
            disabled
            placeholder="Enter your name"
            v-model="name"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            class="form-control"
            disabled
            placeholder="Enter your email"
            v-model="email"
          />
        </div>

        <div class="form-group">
          <label for="pass">Password</label>
          <input
            id="pass"
            type="password"
            class="form-control"
            disabled
            placeholder="Enter your password"
            v-model="pass"
          />
        </div>

        <div class="form-group">
          <button @click="updateProfile" type="button" class="btn btn-primary">
            Update Profile Now
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Navbar from "../Header/Navbar.vue";
import { mapActions } from "vuex";

export default {
  components: { Navbar },
  name: "ProfileForm",
  data() {
    return {
      name: "",
      email: "",
      pass: "",
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.name = JSON.parse(user).name;
      this.email = JSON.parse(user).email;
      this.pass = JSON.parse(user).pass;
    } else {
      this.$router.push({ name: "sign-up" });
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    updateProfile() {
      this.$router.push({ name: "updateProfile" });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.form-container {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 1.5rem;
  color: #343a40;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 5px;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background-color: #e9ecef;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
    border-color: #004085;
  }
}
</style>
