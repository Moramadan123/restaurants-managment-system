<template>
  <div class="container">
    <Navbar />

    <div class="action-buttons mb-3">
      <router-link
        :to="{ name: 'AddNewCategiry', params: { locationId: locationId } }"
      >
        <button class="btn btn-info">Add Category</button>
      </router-link>
      <router-link :to="{ name: 'menu', params: { locationId: locationId } }">
        <button class="btn btn-success">Back To Menu</button>
      </router-link>
      <router-link
        :to="{ name: 'DeleteAllCategory', params: { locationId: locationId } }"
      >
        <button class="btn btn-danger">Delete All Categories</button>
      </router-link>
    </div>

    <div class="text-center mb-4">
      <h1 class="location-name">{{ locatioName }}</h1>
      <h2 class="location-address">{{ locAddress }}</h2>
    </div>

    <table class="table caption-top" v-if="listofCategories.length > 0">
      <caption>
        <span class="num"
          >Number of Categories: {{ listofCategories.length }}</span
        >
      </caption>
      <thead>
        <tr class="table-dark">
          <th scope="col">Name</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cat, i) in listofCategories" :key="i">
          <td>{{ cat.name }}</td>
          <td>
            <router-link
              :to="{
                name: 'UpdateCategory',
                params: { locationId: locationId, catId: cat.id },
              }"
            >
              <button class="btn btn-info">Update</button>
            </router-link>
            &nbsp;
            <router-link
              :to="{
                name: 'DeleteCategory',
                params: { locationId: locationId, catId: cat.id },
              }"
            >
              <button class="btn btn-danger">Delete</button>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="alert alert-warning mt-3" role="alert">
      No Categories Added Yet
    </div>
  </div>
</template>

<script>
import Navbar from "../Header/Navbar.vue";
import { mapState, mapMutations, mapActions } from "vuex";
import axios from "axios";

export default {
  components: { Navbar },
  name: "ViewCategories",
  data() {
    return {
      locationId: this.$route.params.locationId,
      userId: "",
      locatioName: "",
      locAddress: "",
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
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "signup" });
    } else {
      this.userId = JSON.parse(user).id;
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
          this.$store.commit(
            "setCategories",
            result.data.filter(
              (cat) => cat.locationId === parseInt(payload.locationIdIs)
            )
          );
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
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.btn-info {
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
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

.table {
  margin-top: 20px;
}

.table-dark {
  background-color: #343a40;
  color: #fff;
}

.alert-warning {
  background-color: #fff3cd;
  border-color: #ffeeba;
  color: #856404;
}

.num {
  font-weight: bold;
}
</style>
