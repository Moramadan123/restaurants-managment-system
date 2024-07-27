<template>
  <div class="container mt-5">
    <Navbar />

    <div class="text-center mb-4">
      <h1>Update Location: {{ locationId }}</h1>
    </div>

    <form @submit.prevent="UpdateLocations" class="mt-4">
      <div class="row g-3 align-items-center">
        <div class="col-md-6 mx-auto">
          <input
            type="text"
            class="form-control"
            placeholder="Enter Restaurant Name"
            v-model="state.name"
          />
          <span class="error-feedback" v-if="v$.name.$error">
            {{ v$.name.$errors[0].$message }}
          </span>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-md-6 mx-auto">
          <input
            type="text"
            class="form-control"
            placeholder="Enter Phone Number"
            v-model="state.phone"
          />
          <span class="error-feedback" v-if="v$.phone.$error">
            {{ v$.phone.$errors[0].$message }}
          </span>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-md-6 mx-auto">
          <input
            type="text"
            class="form-control"
            placeholder="Enter The Address"
            v-model="state.address"
          />
          <span class="error-feedback" v-if="v$.address.$error">
            {{ v$.address.$errors[0].$message }}
          </span>
        </div>
      </div>
      <br />
      <div class="text-center mb-4">
        <button type="submit" class="btn btn-success">Update Now</button>
      </div>
      <div class="text-center">
        <div v-if="successMessage.length > 0" class="alert alert-success">
          {{ successMessage }}
        </div>
        <div v-if="errormessage.length > 0" class="alert alert-danger">
          {{ errormessage }}
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Navbar from "../Header/Navbar.vue";
import useValidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import axios from "axios";

export default {
  name: "UpdateLocations",
  components: { Navbar },
  data() {
    return {
      userId: "",
      errormessage: "",
      successMessage: "",
      locationId: "",
      locationdata: [],
    };
  },
  mounted() {
    const user = localStorage.getItem("user-info");
    if (user) {
      this.userId = JSON.parse(user).id;
      this.locationId = this.$route.params.locationId;
      this.cancurrentuseraccesslocation();
    } else {
      this.$router.push({ name: "sign-up" });
    }
  },
  setup() {
    const state = reactive({
      name: "",
      phone: "",
      address: "",
    });

    const rules = computed(() => ({
      name: { required, minLength: minLength(10) },
      phone: { required, minLength: minLength(12) },
      address: { required },
    }));

    const v$ = useValidate(rules, state);

    return {
      state,
      v$,
    };
  },
  methods: {
    async cancurrentuseraccesslocation() {
      try {
        const result = await axios.get(
          `http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`
        );
        if (result.status === 200 && result.data.length > 0) {
          this.locationdata = result.data;
          this.state.name = this.locationdata[0].name;
          this.state.address = this.locationdata[0].address;
          this.state.phone = this.locationdata[0].phone;
        } else {
          this.$router.push({ name: "home" });
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
        this.errormessage = "Failed to load location data.";
      }
    },

    async UpdateLocations() {
      this.v$.$validate();
      if (!this.v$.$error) {
        try {
          const result = await axios.put(
            `http://localhost:3000/locations/${this.locationId}`,
            {
              name: this.state.name,
              phone: this.state.phone,
              address: this.state.address,
              userId: this.userId,
            }
          );
          if (result.status === 200) {
            this.errormessage = "";
            this.successMessage = "Location updated successfully";
            setTimeout(() => {
              this.$router.push({ name: "home" });
            }, 1000);
            this.resetForm();
          } else {
            this.successMessage = "";
            this.errormessage = "Something went wrong";
          }
        } catch (error) {
          console.error("Error updating location:", error);
          this.successMessage = "";
          this.errormessage = "Failed to update location.";
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

h1 {
  font-size: 1.75rem;
  font-weight: bold;
}

.text-center {
  text-align: center;
}

.mt-4 {
  margin-top: 1.5rem;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.error-feedback {
  color: red;
  font-size: 0.9em;
  margin-top: 0.5rem;
}

.alert {
  margin-top: 1rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.375rem;
}
</style>
