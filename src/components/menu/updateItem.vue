<template>
  <div class="container">
    <Navbar />

    <router-link :to="{ name: 'menu', params: { locationId: locationId } }">
      <button type="button" class="btn btn-info float-start">Go To Menu</button>
    </router-link>

    <div class="text-center mb-4">
      <h1 class="location-name">{{ locatioName }}</h1>
      <h2 class="location-address">{{ locAddress }}</h2>
    </div>

    <form @submit.prevent="UpdateNow">
      <div class="form-section">
        <hr />
        <div class="form-group">
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="floatingitemname"
              v-model="itemname"
              placeholder="Enter Item Name"
            />
            <label for="floatingitemname">Enter Item Name</label>
          </div>
          <span class="error-feedback" v-if="v$.itemname.$error">
            {{ v$.itemname.$errors[0].$message }}
          </span>
        </div>

        <div class="form-group">
          <div class="form-floating mb-3">
            <input
              type="number"
              class="form-control"
              id="floatingitemqty"
              v-model="itemsQty"
              placeholder="Enter Item Quantity"
            />
            <label for="floatingitemqty">Enter Item Quantity</label>
          </div>
          <span class="error-feedback" v-if="v$.itemsQty.$error">
            {{ v$.itemsQty.$errors[0].$message }}
          </span>
        </div>

        <div class="form-group">
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="floatingprice"
              v-model="price"
              placeholder="Enter Item Price"
            />
            <label for="floatingprice">Enter Item Price</label>
          </div>
          <span class="error-feedback" v-if="v$.price.$error">
            {{ v$.price.$errors[0].$message }}
          </span>
        </div>

        <div class="form-group">
          <div class="form-floating mb-3">
            <select
              class="form-select"
              id="floatingSelect"
              v-model.trim="pickedCat"
            >
              <option value="">Select Category</option>
              <option
                v-for="(cat, i) in listofCategories"
                :key="i"
                :value="cat.id"
              >
                {{ cat.name }}
              </option>
            </select>
            <label for="floatingSelect">Select Category Name</label>
          </div>
          <span class="error-feedback" v-if="v$.pickedCat.$error">
            {{ v$.pickedCat.$errors[0].$message }}
          </span>
        </div>
      </div>

      <div class="form-footer text-center">
        <button type="submit" class="btn btn-primary">Update Now</button>
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
import axios from "axios";
import { mapState, mapMutations, mapActions } from "vuex";
import Navbar from "../Header/Navbar.vue";
import { required, minLength, between } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
  components: { Navbar },
  name: "updateItem",
  data() {
    return {
      v$: useVuelidate(),
      userId: "",
      userName: "",
      locAddress: "",
      locatioName: "",
      locationId: this.$route.params.locationId,
      itemId: this.$route.params.itemId,
      pickedCat: "",
      errormessage: "",
      successMessage: "",
      itemname: "",
      itemsQty: 1,
      price: "",
    };
  },

  computed: {
    ...mapState([
      "isUserLoggedin",
      "numOfcategories",
      "loggedInUserId",
      "listofCategories",
    ]),
  },

  validations() {
    return {
      itemname: { required, minLength: minLength(3) },
      itemsQty: { required, between: between(1, 10000) },
      pickedCat: { required },
      price: { required },
    };
  },

  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "sign-up" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
      this.isLoggedinuser();
      this.displayAllCategories({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
      });
      this.canuseraccessthislocation({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
        redirectTo: "home",
      });
      this.canuseraccessthisitem({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
        itemIdIs: this.itemId,
        redirectTo: "home",
      });
      this.getLocationInfo(this.userId, this.locationId);
      this.getiteminfo(this.userId, this.locationId, this.itemId);
    }
  },

  methods: {
    ...mapMutations([
      "isLoggedinuser",
      "displayAllCategories",
      "canuseraccessthislocation",
      "canuseraccessthisitem",
    ]),
    ...mapActions(["redirectTo"]),

    async getiteminfo(userId, locId, itemId) {
      try {
        let result = await axios.get(
          `http://localhost:3000/items?locationId=${locId}&id=${itemId}`
        );
        let resultData = result.data[0];
        if (result.status === 200 && resultData) {
          this.itemname = resultData.itemname;
          this.itemsQty = resultData.itemsQty;
          this.price = resultData.price;
          this.pickedCat = resultData.catId;
        } else {
          console.error(`Unexpected response status: ${result.status}`);
        }
      } catch (error) {
        console.error("Error fetching item info:", error);
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

    async UpdateNow() {
      this.v$.$validate();
      if (!this.v$.$error) {
        const itemsQty = parseInt(this.itemsQty);
        const userId = parseInt(this.userId, 10);
        const locId = parseInt(this.locationId, 10);
        const price = parseFloat(this.price);

        if (isNaN(itemsQty) || isNaN(userId) || isNaN(locId) || isNaN(price)) {
          this.errormessage = "Invalid input data";
          return;
        }

        try {
          const result = await axios.put(
            `http://localhost:3000/items/${this.itemId}`,
            {
              itemname: this.itemname,
              itemsQty: itemsQty,
              price: price,
              catId: this.pickedCat,
            }
          );
          if (result.status === 200) {
            this.errormessage = "";
            this.successMessage = "Updated Successfully";
            setTimeout(() => {
              this.$router.push({
                name: "menu",
                params: { locationId: this.locationId },
              });
            }, 2000);
          } else {
            this.successMessage = "";
            this.errormessage = "Something went wrong";
          }
        } catch (error) {
          console.error("Error updating data:", error);
          this.successMessage = "";
          this.errormessage = "Failed to Update item";
        }
      }
    },

    getbacktomenu() {
      this.$router.push({
        name: "menu",
        params: { locationId: this.locationId },
      });
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

.btn-info {
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.text-center {
  text-align: center;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.location-name {
  font-size: 2rem;
  font-weight: bold;
}

.location-address {
  font-size: 1.25rem;
  color: #6c757d;
}

.form-section {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-floating {
  margin-bottom: 1rem;
}

.error-feedback {
  color: #dc3545;
  font-size: 0.875rem;
}

.form-footer {
  margin-top: 20px;
}

.alert-container {
  margin-top: 20px;
}

.alert-success {
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c6cb;
}
</style>
