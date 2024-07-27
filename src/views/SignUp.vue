<template>
  <div class="login-page">
    <div class="form-container">
      <form @submit.prevent="signupnow" class="signup-form">
        <h1 class="form-title">Sign Up</h1>

        <div class="form-group">
          <input
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
          <input
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
          <input
            type="password"
            class="form-control"
            placeholder="Enter your password"
            v-model="pass"
          />
          <span class="error-feedback" v-if="v$.pass.$error">
            {{ v$.pass.$errors[0].$message }}
          </span>
        </div>

        <div class="button-group">
          <button type="submit" class="btn btn-primary btn-block">
            Sign Up Now
          </button>
          <button @click="signinpage" type="button" class="btn btn-link btn2">
            Hava an account,Login Now
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";

export default {
  ...mapActions(["redirectTo"]),

  name: "SignUp",
  setup() {
    const v$ = useValidate();
    return { v$ };
  },
  data() {
    return {
      name: "",
      pass: "",
      email: "",
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(10) },
      pass: { required },
      email: { required, email },
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
      this.$router.push({ name: "login" });
    },
    homepage() {
      this.$router.push({ name: "home" });
    },

    async signupnow() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("Form Validate success");
        let result = await axios.post("http://localhost:3000/users", {
          name: this.name,
          email: this.email,
          pass: this.pass,
        });
        if (result.status == 201) {
          console.log("users added successfully");
          //save user data in local storege
          localStorage.setItem("user-info", JSON.stringify(result.data));
          console.log(result);
          console.log(JSON.stringify(result.data));
          // if success redirect to home page
          this.homepage();
        } else {
          console.log("error on adding new user");
        }
      } else {
        console.log("failed");
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

.signup-form {
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

.btn-link {
  color: #1877f2;
  text-decoration: none;
  font-size: 14px;
  margin-top: 10px;
}

.btn2 {
  background-color: green;
  color: white;
  cursor: pointer;
}
</style>
