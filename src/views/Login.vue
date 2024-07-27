<template>
  <div class="login-page">
    <div class="form-container">
      <form @submit.prevent="userlogin" class="login-form">
        <h1 class="form-title">Log In</h1>

        <div class="form-group">
          <input
            type="email"
            class="form-control"
            placeholder="Enter your email"
            v-model="state.email"
          />
          <span class="error-feedback" v-if="v$.email.$error">
            {{ v$.email.$errors[0].$message }}
          </span>
        </div>

        <div class="form-group">
          <input
            type="password"
            class="form-control"
            placeholder="Enter your password"
            v-model="state.pass"
          />
          <span class="error-feedback" v-if="v$.pass.$error">
            {{ v$.pass.$errors[0].$message }}
          </span>
        </div>

        <div class="button-group">
          <button type="submit" class="btn btn-primary btn-block">
            Log In
          </button>
          <button @click="signinpage" type="button" class="btn btn-link btn3">
            Don't have account,Sign Up
          </button>
        </div>

        <div class="error-feedback text-center" v-if="usernotfounderr">
          {{ usernotfounderr }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { mapActions } from "vuex";
import { required, email } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import axios from "axios";

export default {
  setup() {
    const state = reactive({
      pass: "",
      email: "",
    });
    const rules = computed(() => {
      return {
        email: { required, email },
        pass: { required },
      };
    });
    const v$ = useVuelidate(rules, state);
    return {
      state,
      v$,
    };
  },
  name: "LoginForm",
  data() {
    return {
      usernotfounderr: "",
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.redirectTo({ val: "home" });
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    signinpage() {
      this.$router.push({ name: "sign-up" });
    },
    async userlogin() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("form success");
        try {
          let result = await axios.get(
            `http://localhost:3000/users?email=${this.state.email}&pass=${this.state.pass}`
          );
          if (result.status === 200 && result.data.length > 0) {
            localStorage.setItem("user-info", JSON.stringify(result.data[0]));
            this.$router.push({ name: "home" });
          } else {
            this.usernotfounderr = "User not found";
          }
        } catch (error) {
          console.error("An error occurred:", error);
          this.usernotfounderr = "An error occurred. Please try again.";
        }
      } else {
        console.log("form fail");
      }
    },
  },
};
</script>
<style scoped>
.login-page {
  background-color: #f0f2f5; /* Light blue background similar to Facebook's */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.form-container {
  background-color: white;
  padding: 40px 30px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-form {
  width: 100%;
}

.form-title {
  font-size: 32px;
  color: #1877f2; /* Facebook blue color for the title */
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 10px 15px;
  font-size: 16px;
  border: 1px solid #dddfe2;
  border-radius: 4px;
  transition: border-color 0.2s;
}

.form-control:focus {
  border-color: #1877f2; /* Focus color similar to Facebook */
  outline: none;
  box-shadow: none;
}

.error-feedback {
  color: #f02849; /* Red color for error messages */
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.button-group {
  text-align: center;
}

.btn-primary {
  background-color: #1877f2;
  border-color: #1877f2;
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 6px;
  width: 100%;
  max-width: 200px;
  margin-bottom: 15px;
}

.btn-primary:hover {
  background-color: #166fe5;
  border-color: #166fe5;
}

.btn-link {
  color: #1877f2;
  text-decoration: none;
  font-size: 14px;
  margin-top: 10px;
}

.btn-link:hover {
  text-decoration: underline;
}
.btn3 {
  background-color: green;
  color: white;
  cursor: pointer;
}
</style>
