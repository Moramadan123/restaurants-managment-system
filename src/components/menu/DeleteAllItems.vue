<template>
  <div class="container">
    <Navbar />

    <router-link :to="{ name: 'menu', params: { locationId: locationId } }">
      <button type="button" class="float-start btn btn-info">Go To Menu</button>
    </router-link>

    <form @submit.prevent>
      <div class="text-center">
        <h1 class="location-address">{{ locAddress }}</h1>
        <h2 class="location-name">{{ locName }}</h2>
        <hr />
        <p class="warning-text">
          Are you sure you want to delete all items of this location?
        </p>
        <div class="button-group">
          <button @click="goback" class="btn btn-info">Go Back</button>
          <button @click="DeleteAllItem" class="btn btn-danger">
            Delete Now
          </button>
        </div>
        <div class="alert-container">
          <div class="alert alert-warning" v-if="errormessage.length > 0">
            {{ errormessage }}
          </div>
          <div class="alert alert-success" v-if="successmessage.length > 0">
            {{ successmessage }}
          </div>
        </div>
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
  name: "DeleteAllItems",
  data() {
    return {
      userId: "",
      successmessage: "",
      errormessage: "",
      locationId: this.$route.params.locationId,
      allItemsIdIs: [],
      locName: "",
      locAddress: "",
      myresult: "",
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
        `http://localhost:3000/items?userId=${this.userId}&locId=${this.locationId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.myresult = result.data;
        let reultength = this.myresult.length;
        for (let i = 0; i < reultength; i++) {
          this.allItemsIdIs.push(result.data[i].id);
        }
        console.log(result.data.length);
      }
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
    async DeleteAllItem() {
      try {
        let allResult = [];
        for (var i = 0; i < this.allItemsIdIs.length; i++) {
          try {
            const response = await axios.delete(
              `http://localhost:3000/items/${this.allItemsIdIs[i]}`
            );
            if (response.status == 200) {
              allResult.push(true);
            } else {
              console.error(`Failed to delete item ${this.allItemsIdIs[i]}`);
              allResult.push(false);
            }
          } catch (error) {
            console.error(
              `Error deleting item ${this.allItemsIdIs[i]}:`,
              error
            );
            allResult.push(false);
          }
        }

        if (!allResult.includes(false)) {
          this.successmessage = "All items deleted successfully.";
          setTimeout(() => {
            this.$router.push({
              name: "menu",
              params: { locationId: this.locationId },
            });
          }, 1000);
        } else {
          this.errormessage = "Error deleting one or more items.";
          console.error("Error deleting one or more items.");
        }
      } catch (error) {
        console.error("Error during deletion process:", error);
        this.errormessage = "Error during deletion process.";
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

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.text-center {
  text-align: center;
}

.location-address {
  font-size: 1.5rem;
  color: #343a40;
}

.location-name {
  font-size: 1.25rem;
  color: #6c757d;
}

.warning-text {
  color: red;
  font-weight: bold;
  margin: 20px 0;
}

.button-group {
  margin-top: 20px;
}

.btn-info {
  background-color: #17a2b8;
  border-color: #17a2b8;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  margin-right: 10px;
}

.btn-info:hover {
  background-color: #117a8b;
  border-color: #10707f;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.alert-container {
  margin-top: 20px;
}

.alert-warning {
  color: #856404;
}

.alert-success {
  color: #155724;
}
</style>
