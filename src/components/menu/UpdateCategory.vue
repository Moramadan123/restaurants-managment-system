<template>
  <div class="container">
    <Navbar />

    <div class="button-group mb-3">
      <router-link
        :to="{ name: 'ViewCategories', params: { locationId: locationId } }"
      >
        <button class="btn btn-info">Back to category</button>
      </router-link>
      &nbsp;
      <router-link :to="{ name: 'menu', params: { locationId: locationId } }">
        <button class="btn btn-success">Back To menu</button>
      </router-link>
    </div>

    <div class="text-center mb-4">
      <h1 class="location-name">{{ locationName }}</h1>
      <h2 class="location-address">{{ locAddress }}</h2>
    </div>

    <form @submit.prevent="UpdateCategory">
      <div class="form-group">
        <h2 class="form-title">Update Category</h2>
        <input
          type="text"
          class="form-control"
          placeholder="Enter New Name"
          v-model="name"
        />
        <span class="error-feedback" v-if="v$.name.$error">
          {{ v$.name.$errors[0].$message }}
        </span>
      </div>

      <div class="form-footer">
        <button type="submit" class="btn btn-success">Update Now</button>
      </div>

      <div class="alert-container">
        <div class="alert alert-success" v-if="successMessage.length > 0">
          {{ successMessage }}
        </div>
        <div class="alert alert-danger" v-if="errormessage.length > 0">
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
  name: "UpdateCategory",
  components: { Navbar },
  data() {
    return {
      v$: useValidate(),
      locationId: this.$route.params.locationId,
      catId: this.$route.params.catId,
      userId: "",
      locationName: "",
      locAddress: "",
      successMessage: "",
      name: "",
      errormessage: "",
      listOfUserCategories: [],
      categorynames: [],
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(3), maxLength: maxLength(15) },
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "signup" });
    } else {
      this.userId = JSON.parse(user).id;
      this.getLocationInfo(this.userId, this.locationId);
      this.getcategoryname(this.userId, this.locationId, this.catId);
      this.displayAllCategories({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
      });
      this.canuseraccessthiscategory({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
        catIdIs: this.catId,
        redirectTo: "home",
      });
    }
  },
  methods: {
    ...mapMutations([
      "isLoggedinuser",
      "displayAllCategories",
      "canuseraccessthislocation",
      "canuseraccessthiscategory",
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
          const locDetails = result.data.find(
            (location) => location.id === parseInt(locId)
          );
          if (locDetails) {
            this.locationName = locDetails.name;
            this.locAddress = locDetails.address;
          }
        }
      } catch (error) {
        console.error("Error fetching location info:", error);
      }
    },
    async getcategoryname(userId, locationId, catId) {
      let result = await axios.get(
        `http://localhost:3000/locations?userId=${userId}&locationId=${locationId}&id=${catId}`
      );
      if (result.status === 200) {
        this.categorynames = result.data;
        if (this.categorynames.length > 0) {
          this.name = this.categorynames.name;
        }
      } else {
        console.error(`Unexpected response status: ${result.status}`);
      }
    },
    async UpdateCategory() {
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
            let result = await axios.put(
              `http://localhost:3000/categories/${this.catId}`,
              {
                name: this.name,
                userId: this.userId,
                locationId: parseInt(this.locationId),
              }
            );
            if (result.status === 200) {
              this.successMessage = "Updated Name successfully";
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
            console.error("Error updating category:", error);
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

.button-group {
  margin-bottom: 20px;
}

.btn-info,
.btn-success {
  padding: 10px 20px;
  font-size: 1rem;
}

.btn-info {
  background-color: #17a2b8;
  border-color: #17a2b8;
  color: white;
}

.btn-info:hover {
  background-color: #117a8b;
  border-color: #10707f;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.text-center {
  text-align: center;
}

.mb {
  margin-bottom: 0;
}

.location-name {
  font-size: 1.5rem;
  color: #343a40;
}

.location-address {
  font-size: 1.25rem;
  color: #6c757d;
}

.form-group {
  margin-bottom: 20px;
}

.form-title {
  font-size: 1.5rem;
  color: #343a40;
}

.form-control {
  font-size: 1rem;
  padding: 10px;
  margin-bottom: 10px;
}

.error-feedback {
  color: #dc3545;
  font-size: 0.875rem;
}

.alert-container {
  margin-top: 20px;
}

.alert-success {
  color: #155724;
}

.alert-danger {
  color: #721c24;
}
</style>
