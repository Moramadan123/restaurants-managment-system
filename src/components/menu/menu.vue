<template>
  <Navbar />
  <div class="container">
    <div class="button-container">
      <router-link
        :to="{ name: 'AddNewCategiry', params: { locationId: locationId } }"
      >
        <button type="button" class="btn btn-success">
          View/Add Categories
        </button>
      </router-link>
      <router-link
        :to="{ name: 'AddNewItems', params: { locationId: locationId } }"
      >
        <button
          type="button"
          class="btn btn-success"
          v-if="numOfcategories > 0"
        >
          Add New Items
        </button>
      </router-link>
    </div>

    <div class="text-center location-info">
      <h1 class="mb">{{ locatioName }}</h1>
      <h2>{{ locAddress }}</h2>
    </div>
    <router-link
      v-if="listofCategories.length > 0"
      :to="{ name: 'DeleteAllItems', params: { locationId: locationId } }"
    >
      <button type="button" class="btn btn-danger" v-if="numOfcategories > 0">
        Delete All
      </button>
    </router-link>
    <div class="categories-container">
      <div v-for="(cat, i) in listofCategories" :key="i" class="category-card">
        <div class="catname">
          <h4>{{ cat.name }}</h4>
        </div>
        <div class="items-container">
          <div
            v-for="(item, h) in getItemsByCategory(cat.id)"
            :key="h"
            class="item-card"
          >
            <h5>{{ item.itemname }}</h5>
            <p>Price: {{ item.price }}</p>
            <p>Quantity: {{ item.itemsQty }}</p>
            <div class="buttons">
              <router-link
                :to="{
                  name: 'updateItem',
                  params: { itemId: item.id, locationId: locationId },
                }"
              >
                <button type="button" class="btn btn-info btn4">Update</button>
              </router-link>
              <router-link
                class="float-right"
                :to="{
                  name: 'DeleteItem',
                  params: { itemId: item.id, locationId: locationId },
                }"
              >
                <button type="button" class="btn btn-danger btn4">
                  Delete
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations, mapActions } from "vuex";
import Navbar from "../Header/Navbar.vue";

export default {
  components: { Navbar },
  name: "MenuPage",
  data() {
    return {
      userId: "",
      userName: "",
      locAddress: "",
      locatioName: "",
      locationId: this.$route.params.locationId,
      listofusercategories: [],
      listofitems: [],
    };
  },
  computed: {
    ...mapState([
      "isUserLoggedin",
      "numOfcategories",
      "loggedInUserId",
      "listofCategories",
    ]),

    getItemsByCategory() {
      return (categoryId) => {
        return this.listofitems.filter((item) => item.catId === categoryId);
      };
    },
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
      this.getCurrentusercategories(this.userId, this.locationId);
      this.getCurrentuseritems(this.userId, this.locationId);
    }
  },
  methods: {
    ...mapMutations([
      "isLoggedinuser",
      "displayAllCategories",
      "canuseraccessthislocation",
    ]),
    async getCurrentusercategories(userId, locId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locId}`
      );
      if (result.status === 200) {
        this.listofusercategories = result.data;
        console.table(this.listofusercategories);
      } else {
        console.error(`Unexpected response status: ${result.status}`);
      }
    },
    async getCurrentuseritems(userId, locId) {
      let result = await axios.get(
        `http://localhost:3000/items?userId=${userId}&locationId=${locId}`
      );
      if (result.status === 200) {
        this.listofitems = result.data;
        console.table(this.listofitems);
      } else {
        console.error(`Unexpected response status: ${result.status}`);
      }
    },
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
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.location-info {
  margin-bottom: 30px;
}

.categories-container {
  display: grid;
  grid-gap: 20px;
}

.category-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 15px;
  text-align: center;
}

.items-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns for items */
  grid-gap: 20px;
  margin-top: 15px;
}

.item-card {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mb {
  margin-bottom: 0;
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
}
.btn4 {
  width: 20px;
  font-size: 7px;
  display: flex;
  justify-content: center;
}
.buttons {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 2px;
  text-align: center;
  font-weight: bold;
}
@media (max-width: 1200px) {
  .categories-container {
    grid-template-columns: repeat(2, 1fr); /* 2 columns for medium screens */
  }
  .items-container {
    grid-template-columns: repeat(2, 1fr); /* 2 columns for medium screens */
  }
}

@media (max-width: 768px) {
  .categories-container {
    grid-template-columns: 1fr; /* 1 column for small screens */
  }
  .items-container {
    grid-template-columns: 1fr; /* 1 column for small screens */
  }
}
</style>
