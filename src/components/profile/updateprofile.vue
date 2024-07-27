<template>
  <div class="container">
    <Navbar />
    <form @submit.prevent="updateProfilenow">
      <div class="form-container">
        <h1>Update Your Profile</h1>

        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            type="text"
            class="form-control"
            placeholder="Enter your name"
            v-model="name"
          />
          <span class="error-feedback" v-if="v$.name.$error">
            {{ v$.name.$errors[0].$message }}
          </span>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            class="form-control"
            placeholder="Enter your email"
            v-model="email"
          />
          <span class="error-feedback" v-if="v$.email.$error">
            {{ v$.email.$errors[0].$message }}
          </span>
        </div>

        <div class="form-group">
          <label for="pass">Password</label>
          <input
            id="pass"
            type="password"
            class="form-control"
            placeholder="Enter your password"
            v-model="pass"
          />
          <span class="error-feedback" v-if="v$.pass.$error">
            {{ v$.pass.$errors[0].$message }}
          </span>
        </div>

        <div class="form-group">
          <button
            @click="updateProfilenow"
            type="submit"
            class="btn btn-primary"
          >
            Update Profile Now
          </button>
        </div>

        <div class="form-group">
          <div class="error-feedback">
            {{ usernotfounderr }}
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import Navbar from "../Header/Navbar.vue";
import { required, email, minLength } from "@vuelidate/validators";
import axios from "axios";
import { mapActions } from "vuex";

export default {
  components: { Navbar },
  name: "updateProfile",
  data() {
    return {
      v$: useVuelidate(),
      name: "",
      email: "",
      pass: "",
      userId: "",
      usernotfounderr: "",
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(10) },
      email: { required, email },
      pass: { required, minLength: minLength(10) },
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.name = JSON.parse(user).name;
      this.email = JSON.parse(user).email;
      this.pass = JSON.parse(user).pass;
      this.userId = JSON.parse(user).id;
    } else {
      this.$router.push({ name: "sign-up" });
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async updateProfilenow() {
      this.v$.$validate();
      if (!this.v$.$error) {
        let result = await axios.put(
          `http://localhost:3000/users/${this.userId}`,
          {
            name: this.name,
            email: this.email,
            pass: this.pass,
          }
        );
        if (result.status == 200) {
          localStorage.setItem("user-info", JSON.stringify(result.data));
          this.$router.push({ name: "home" });
        } else {
          this.usernotfounderr = "Error updating profile.";
        }
      }
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

.error-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 5px;
}
</style>
