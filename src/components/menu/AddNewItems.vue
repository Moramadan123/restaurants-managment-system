<template>
  <div class="container">
    <Navbar />

    <div class="action-buttons">
      <router-link :to="{ name: 'menu', params: { locationId: locationId } }">
        <button type="button" class="btn btn-info">Go To Menu</button>
      </router-link>
    </div>

    <div class="text-center">
      <h1 class="location-title">{{ locatioName }}</h1>
      <h2 class="location-address">{{ locAddress }}</h2>
    </div>

    <form @submit.prevent="AddNewItems" class="form-container">
      <hr class="divider" />

      <div class="form-group">
        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="floatingItemName"
            placeholder="Item Name"
            v-model="itemname"
          />
          <label for="floatingItemName">Enter Item Name</label>
          <span class="error-feedback" v-if="v$.itemname.$error">
            {{ v$.itemname.$errors[0].$message }}
          </span>
        </div>
      </div>

      <div class="form-group">
        <div class="form-floating mb-3">
          <input
            type="number"
            class="form-control"
            id="floatingItemQty"
            placeholder="Item Quantity"
            v-model="itemsQty"
          />
          <label for="floatingItemQty">Enter Item Quantity</label>
          <span class="error-feedback" v-if="v$.itemsQty.$error">
            {{ v$.itemsQty.$errors[0].$message }}
          </span>
        </div>
      </div>

      <div class="form-group">
        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="floatingPrice"
            placeholder="Item Price"
            v-model="price"
          />
          <label for="floatingPrice">Enter Item Price</label>
          <span class="error-feedback" v-if="v$.price.$error">
            {{ v$.price.$errors[0].$message }}
          </span>
        </div>
      </div>

      <div class="form-group">
        <div class="form-floating mb-3">
          <select
            class="form-select"
            id="floatingSelectCategory"
            v-model.trim="pickedCat"
          >
            <option value="" disabled>Select Category</option>
            <option
              v-for="(cat, i) in listofCategories"
              :key="i"
              :value="cat.id"
            >
              {{ cat.name }}
            </option>
          </select>
          <label for="floatingSelectCategory">Select Category</label>
          <span class="error-feedback" v-if="v$.pickedCat.$error">
            {{ v$.pickedCat.$errors[0].$message }}
          </span>
        </div>
      </div>

      <div class="form-footer">
        <button type="submit" class="btn btn-primary">Add Now</button>
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
  name: "AddNewItems",
  data() {
    return {
      v$: useVuelidate(),
      userId: "",
      userName: "",
      locAddress: "",
      locatioName: "",
      locationId: this.$route.params.locationId,
      pickedCat: "",
      errormessage: "",
      successMessage: "",
      itemname: "",
      itemsQty: 1,
      Description: "",
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
      itemname: { required, minLength: minLength(6) },
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
      this.getLocationInfo(this.userId, this.locationId);
    }
  },
  methods: {
    ...mapMutations([
      "isLoggedinuser",
      "displayAllCategories",
      "canuseraccessthislocation",
    ]),
    ...mapActions(["redirectTo"]),
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
            console.table(locDetails);
          } else {
            console.error("Location not found");
          }
        }
      } catch (error) {
        console.error("Error fetching location info:", error);
      }
    },
    async AddNewItems() {
      this.v$.$validate();
      if (!this.v$.$error) {
        const itemsQty = parseInt(this.itemsQty, 10);
        const userId = parseInt(this.userId, 10);
        const locId = parseInt(this.locationId, 10);
        const price = parseFloat(this.price).toFixed(2);

        if (isNaN(itemsQty) || isNaN(userId) || isNaN(locId) || isNaN(price)) {
          this.errormessage = "Invalid input data";
          return;
        }

        try {
          const result = await axios.post(`http://localhost:3000/items`, {
            itemname: this.itemname,
            price: price,
            itemsQty: itemsQty,
            userId: userId,
            catId: this.pickedCat,
            locId: locId,
            id: this.id,
          });

          if (result.status === 201) {
            this.errormessage = "";
            this.successMessage = "Added new item";
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
          console.error("Error posting data:", error);
          this.successMessage = "";
          this.errormessage = "Failed to add item";
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

.action-buttons {
  margin-bottom: 20px;
}

.action-buttons button {
  margin-right: 10px;
}

.text-center {
  margin-bottom: 20px;
}

.location-title {
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

.divider {
  border-top: 1px solid #dee2e6;
}

.form-floating {
  margin-bottom: 15px;
}

.form-control,
.form-select {
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

.error-feedback {
  color: red;
  display: block;
  margin-top: 5px;
}

.alert-container {
  margin-top: 20px;
}

.alert-success {
  color: green;
}

.alert-danger {
  color: red;
}
</style>
