<template>
  <div class="container mt-5">
    <Navbar />

    <div class="text-center mb-4">
      <h1 class="page-title">Adding New Restaurant</h1>
    </div>

    <form @submit.prevent="addLocation" class="form">
      <div class="form-group">
        <input
          type="text"
          class="form-control"
          placeholder="Enter Restaurant Name"
          v-model="state.name"
        />
        <span class="error-feedback" v-if="v$.name.$error">{{
          v$.name.$errors[0].$message
        }}</span>
      </div>

      <div class="form-group">
        <input
          type="text"
          class="form-control"
          placeholder="Enter Phone Number"
          v-model="state.phone"
        />
        <span class="error-feedback" v-if="v$.phone.$error">{{
          v$.phone.$errors[0].$message
        }}</span>
      </div>

      <div class="form-group">
        <input
          type="text"
          class="form-control"
          placeholder="Enter The Address"
          v-model="state.address"
        />
        <span class="error-feedback" v-if="v$.address.$error">{{
          v$.address.$errors[0].$message
        }}</span>
      </div>

      <div class="text-center mb-4">
        <button type="submit" class="btn btn-primary">Add Now</button>
      </div>

      <div class="text-center">
        <div
          class="success alert alert-success"
          v-if="successMessage.length > 0"
        >
          {{ successMessage }}
        </div>
        <div class="error alert alert-danger" v-if="errormessage.length > 0">
          {{ errormessage }}
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import useValidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import axios from "axios";
import Navbar from "../Header/Navbar.vue";

export default {
  components: { Navbar },
  name: "AddNewLocation",
  data() {
    return {
      userId: "",
      errormessage: "",
      successMessage: "",
    };
  },
  setup() {
    const state = reactive({
      name: "",
      phone: "",
      address: "",
    });

    const rules = computed(() => ({
      name: { required, minLength: minLength(3) },
      phone: { required, minLength: minLength(12) },
      address: { required },
    }));

    const v$ = useValidate(rules, state);

    return {
      state,
      v$,
    };
  },
  mounted() {
    const user = localStorage.getItem("user-info");
    if (user) {
      this.userId = JSON.parse(user).id;
    } else {
      this.$router.push({ name: "sign-up" });
    }
  },
  methods: {
    async addLocation() {
      this.v$.$validate();
      if (!this.v$.$error) {
        try {
          const result = await axios.post(`http://localhost:3000/locations`, {
            name: this.state.name,
            phone: this.state.phone,
            address: this.state.address,
            userId: this.userId,
          });
          if (result.status === 201) {
            this.successMessage = "Restaurant added successfully!";
            setTimeout(() => {
              this.$router.push({ name: "home" });
            }, 2000);
            this.resetForm();
          } else {
            this.errormessage = "Something went wrong.";
          }
        } catch (error) {
          console.error("Error adding location:", error);
          this.errormessage = "Failed to add restaurant.";
        }
      }
    },
    resetForm() {
      this.state.name = "";
      this.state.phone = "";
      this.state.address = "";
      this.v$.$reset();
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin-top: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
}

.form {
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.success,
.error {
  text-align: center;
  margin-top: 1rem;
}

.error-feedback {
  color: red;
  font-size: 0.9em;
  margin-top: 0.5rem;
}
</style>
