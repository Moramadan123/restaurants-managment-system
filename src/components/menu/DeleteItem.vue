<template>
  <div class="container">
    <Navbar />

    <router-link :to="{ name: 'menu', params: { locationId: locationId } }">
      <button type="button" class="float-start btn btn-info">Go To menu</button>
    </router-link>

    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <h1>{{ locAddress }}</h1>
          <h2>{{ locName }}</h2>
          <!-- Corrected property name -->
          <h2>Delete #{{ itemname }}</h2>
          <h2>Delete #{{ itemId }}</h2>
          <hr />
          <p class="text-danger">Are you sure you want to delete this Item?</p>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block px-2">
          <button @click="goback" class="btn btn-info px-2 me-2">
            Go Back
          </button>
          <button @click="DeleteItem" class="btn btn-danger px-2">
            Delete Now
          </button>
        </div>
      </div>
      <div
        class="success col-auto d-block mx-auto alert alert-warning"
        v-if="errormessage.length > 0"
      >
        {{ errormessage }}
      </div>
      <div
        class="success col-auto d-block mx-auto alert alert-success"
        v-if="successmessage.length > 0"
      >
        {{ successmessage }}
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Navbar from "../Header/Navbar.vue";
import { mapMutations } from "vuex";

export default {
  components: { Navbar },
  name: "DeleteItem",
  data() {
    return {
      userId: "",
      successmessage: "",
      errormessage: "",
      locationId: this.$route.params.locationId,
      itemId: this.$route.params.itemId,
      allItemsIdIs: [],
      locName: "",
      locAddress: "",
      itemname: "",
      itemsQty: 1,
      price: "",
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "signup" });
    } else {
      const userInfo = JSON.parse(user);
      this.userId = userInfo.id;
      this.locationId = this.$route.params.locationId;
      this.catId = this.$route.params.catId;
      await this.getItemInfo();
      this.canuseraccessthisitem({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
        itemIdIs: this.itemId,
        redirectTo: "home",
      });
      this.canuseraccessthislocation({
        redirectTo: "home",
      });
      let result = await axios.get(
        `http://localhost:3000/items?catId=${this.catId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        let reultength = result.data.length;
        for (let i = 0; i < reultength; i++) {
          this.allItemsIdIs.push(result.data[i].id);
        }
        console.log(result.data.length);
      }
      await this.getItemInfo(this.userId, this.locationId);
      this.getLocationInfo(this.userId, this.locationId);
    }
  },
  methods: {
    ...mapMutations([
      "isLoggedinuser",
      "displayAllCategories",
      "canuseraccessthiscategory",
      "canuseraccessthisitem",
      "canuseraccessthislocation",
    ]),
    // async getCategoryName() {
    //   try {
    //     const response = await axios.get(
    //       `http://localhost:3000/categories?id=${this.catId}&userId=${this.userId}`
    //     );
    //     if (response.status === 200 && response.data.length > 0) {
    //       this.name = response.data[0].name;
    //     } else {
    //       this.errormessage = "Category not found.";
    //     }
    //   } catch (error) {
    //     console.error("Error fetching category name:", error);
    //     this.errormessage = "Error fetching category name.";
    //   }
    // },
    async DeleteItem() {
      try {
        const response = await axios.delete(
          `http://localhost:3000/items/${this.itemId}`
        );
        let allResult = [];
        for (var i = 0; i < this.allItemsIdIs.length; i++) {
          const response = await axios.delete(
            `http://localhost:3000/items/${this.allItemsIdIs[i]}`
          );
          if (response.status == 200 && !allResult.includes(false)) {
            allResult.push(true);
          } else {
            allResult.push(false);
          }
        }
        if (response.status === 200) {
          this.successmessage = "item deleted successfully";
          setTimeout(() => {
            this.$router.push({
              name: "ViewCategories",
              params: { locationId: this.locationId },
            });
          }, 1000);
        } else {
          this.errormessage = "Error deleting category";
          console.error("Error deleting category");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        this.errormessage = "Error deleting category";
      }
    },
    goback() {
      this.$router.push({
        name: "menu",
        params: { locationId: this.locationId },
      });
    },
    async getItemInfo(userId, itemId) {
      try {
        let result = await axios.get(
          `http://localhost:3000/items?userId=${userId}&itemId=${itemId}`
        );
        console.log("API Result:", result.data); // Log API response

        if (result.status === 200 && result.data.length > 0) {
          let locDetails2 = result.data.find((item) => item.itemId === itemId);
          if (locDetails2) {
            this.itemname = locDetails2.itemname; // Handle missing itemname
            console.log("Item Name:", this.itemname); // Log item name
          } else {
            console.error("Item not found");
          }
        } else {
          console.error("No data found");
        }
      } catch (error) {
        console.error("Error fetching location info:", error);
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
            this.locName = locDetails.name; // Correct property assignment
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
  },
};
</script>

<style></style>
