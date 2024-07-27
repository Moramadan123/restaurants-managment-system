<template>
  <div class="container">
    <Navbar />
    <div class="buttons">
      <router-link
        :to="{ name: 'ViewCategories', params: { locationId: locationId } }"
      >
        <button class="btn btn-info">Back to Categories</button>
      </router-link>
      <router-link :to="{ name: 'menu', params: { locationId: locationId } }">
        <button class="btn btn-success">Back to Menu</button>
      </router-link>
    </div>

    <div class="text-center">
      <h1 class="location-name">{{ locatioName }}</h1>
      <h2 class="location-address">{{ locAddress }}</h2>
    </div>

    <form @submit.prevent="addCategory" class="form-container">
      <div class="row g-3 align-items-center">
        <div class="col-md-6 mx-auto">
          <h2>Add New Category</h2>
          <input
            type="text"
            class="form-control"
            placeholder="Enter Category Name"
            v-model="name"
          />
          <span class="error-feedback" v-if="v$.name.$error">
            {{ v$.name.$errors[0].$message }}
          </span>
        </div>
      </div>

      <div class="form-footer">
        <button type="submit" class="btn btn-primary">Add Now</button>
      </div>

      <div class="messages">
        <div class="success" v-if="successMessage.length > 0">
          {{ successMessage }}
        </div>
        <div class="error" v-if="errormessage.length > 0">
          {{ errormessage }}
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Navbar from "../Header/Navbar.vue";
import { mapActions, mapMutations } from "vuex";
import useValidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import axios from "axios";

export default {
  name: "AddNewCategory",
  components: { Navbar },
  data() {
    return {
      v$: useValidate(),
      locationId: this.$route.params.locationId,
      userId: "",
      locatioName: "",
      locAddress: "",
      successMessage: "",
      name: "",
      errormessage: "",
      listOfUserCategories: [],
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(2), maxLength: maxLength(15) },
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "signup" });
    } else {
      this.userId = JSON.parse(user).id;
      this.canuseraccessthislocation({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
      });
      await this.getLocationInfo(this.userId, this.locationId);
      await this.displayAllCategories({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
      });
    }
  },
  methods: {
    ...mapMutations([
      "isLoggedinuser",
      "displayAllCategories",
      "canuseraccessthislocation",
    ]),
    ...mapActions(["redirectTo"]),
    async displayAllCategories(payload) {
      try {
        let result = await axios.get(
          `http://localhost:3000/categories?userId=${payload.userIdIs}&locationId=${payload.locationIdIs}`
        );
        if (result.status === 200) {
          this.listOfUserCategories = result.data;
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    async getLocationInfo(userId, locId) {
      try {
        let result = await axios.get(
          `http://localhost:3000/locations?userId=${userId}&id=${locId}`
        );
        if (result.status === 200 && result.data.length > 0) {
          let locDetails = result.data.find(
            (location) => location.id === locId
          );
          if (locDetails) {
            this.locatioName = locDetails.name;
            this.locAddress = locDetails.address;
          } else {
            console.error("Location not found");
          }
        }
      } catch (error) {
        console.error("Error fetching location info:", error);
      }
    },
    async addCategory() {
      this.v$.$validate();
      const categoryExists = this.listOfUserCategories.some(
        (v) => v.name.toLowerCase() === this.name.toLowerCase()
      );

      if (!this.v$.$error) {
        if (categoryExists) {
          this.successMessage = "";
          this.errormessage = "Name already exists";
        } else {
          try {
            let result = await axios.post(`http://localhost:3000/categories`, {
              name: this.name,
              userId: this.userId,
              locationId: parseInt(this.locationId),
            });
            if (result.status === 201) {
              this.successMessage = "Added new category successfully";
              this.errormessage = "";
              setTimeout(() => {
                this.$router.push({
                  name: "ViewCategories",
                  params: { locationId: this.locationId },
                });
              }, 1000);
            }
          } catch (error) {
            this.successMessage = "";
            this.errormessage = "Something went wrong, please try again";
            console.error("Error adding category:", error);
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.buttons {
  margin-bottom: 20px;
}

.buttons button {
  margin-right: 10px;
}

.text-center {
  margin-bottom: 20px;
}

.location-name {
  font-size: 1.5rem;
  color: #343a40;
}

.location-address {
  font-size: 1.2rem;
  color: #6c757d;
}

.form-container {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-container h2 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
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
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.messages {
  margin-top: 20px;
}

.success {
  color: green;
}

.error {
  color: red;
}

.error-feedback {
  color: red;
}
</style>
