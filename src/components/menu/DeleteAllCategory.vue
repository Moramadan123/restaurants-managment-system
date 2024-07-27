<template>
  <div class="container">
    <Navbar />
    <form @submit.prevent>
      <div class="text-center">
        <h1 class="title">Delete All Categories of:</h1>
        <h2 class="location-title">{{ locatioName }}</h2>
        <h3 class="location-address">{{ locAddress }}</h3>
        <hr />
        <p class="warning-text">
          Are you sure you want to delete all categories for this location?
        </p>
        <div class="button-group">
          <button @click="goback" class="btn btn-info">Go Back</button>
          <button @click="DeleteAllCategory" class="btn btn-danger">
            Delete Now
          </button>
        </div>
      </div>
      <div class="alert-container">
        <div class="alert alert-warning" v-if="errormessage.length > 0">
          {{ errormessage }}
        </div>
        <div class="alert alert-success" v-if="successmessage.length > 0">
          {{ successmessage }}
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
  name: "DeleteCategory",
  data() {
    return {
      userId: "",
      successmessage: "",
      errormessage: "",
      catId: "",
      locationName: "",
      locAddress: "",
      locatioName: "",
      locationId: this.$route.params.locationId,
      allItemsIdIs: [],
      allCatIdIs: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "signup" });
    } else {
      const userInfo = JSON.parse(user);
      this.userId = userInfo.id;
      this.catId = this.$route.params.catId;

      let result = await axios.get(
        `http://localhost:3000/items?locId=${this.catId}`
      );
      this.allItemsIdIs = result.data.map((item) => item.id);

      let resultforcategories = await axios.get(
        `http://localhost:3000/categories?locationId=${this.locationId}`
      );
      this.allCatIdIs = resultforcategories.data.map((cat) => cat.id);

      this.getLocationInfo(this.userId, this.locationId);
    }
  },
  methods: {
    ...mapMutations(["isLoggedinuser", "displayAllCategories"]),
    async DeleteAllCategory() {
      try {
        let allResults = [];

        // Delete all items
        for (const id of this.allItemsIdIs) {
          const response = await axios.delete(
            `http://localhost:3000/items/${id}`
          );
          allResults.push(response.status === 200);
        }

        // Delete all categories
        for (const id of this.allCatIdIs) {
          const response = await axios.delete(
            `http://localhost:3000/categories/${id}`
          );
          allResults.push(response.status === 200);
        }

        if (allResults.every((result) => result)) {
          this.successmessage =
            "All categories and related items deleted successfully";
          setTimeout(() => {
            this.$router.push({
              name: "home",
              params: { locationId: this.locationId },
            });
          }, 1000);
        } else {
          this.errormessage = "Error deleting some categories or items";
        }
      } catch (error) {
        console.error("Error deleting categories and items:", error);
        this.errormessage = "Error deleting categories and items";
      }
    },
    goback() {
      this.$router.push({
        name: "ViewCategories",
        params: { locationId: this.locationId },
      });
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

.title {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.location-title {
  font-size: 1.25rem;
  color: #343a40;
}

.location-address {
  font-size: 1.1rem;
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
