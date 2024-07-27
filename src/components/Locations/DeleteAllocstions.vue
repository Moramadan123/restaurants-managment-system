<template>
  <div class="container mt-5">
    <Navbar />

    <div class="text-center mb-4">
      <h1 class="page-title">Delete All Restaurant</h1>
      <hr />
      <p class="text-danger mb-4">
        Are you sure you want to delete all these locations?
      </p>
    </div>

    <div class="text-center mb-4">
      <button @click="goback" class="btn btn-info me-2">Go Back</button>
      <button @click="deleteAllRestaurant" class="btn btn-danger">
        Delete All
      </button>
    </div>

    <div v-if="errormessage.length > 0" class="alert alert-danger text-center">
      {{ errormessage }}
    </div>
    <div
      v-if="successmessage.length > 0"
      class="alert alert-success text-center"
    >
      {{ successmessage }}
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Navbar from "../Header/Navbar.vue";

export default {
  components: { Navbar },
  name: "DeleteAllLocations",
  data() {
    return {
      userId: "",
      errormessage: "",
      successmessage: "",
      allLocationsid: [],
    };
  },
  async mounted() {
    const user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "sign-up" });
    } else {
      this.userId = JSON.parse(user).id;
      try {
        let result = await axios.get(
          `http://localhost:3000/locations?userId=${this.userId}`
        );
        this.allLocationsid = result.data.map((location) => location.id);
      } catch (error) {
        console.error("Error fetching locations:", error);
        this.errormessage = "Failed to load locations.";
      }
    }
  },
  methods: {
    goback() {
      this.$router.push({ name: "home" });
    },
    async deleteAllRestaurant() {
      try {
        const deleteRequests = this.allLocationsid.map((id) =>
          axios.delete(`http://localhost:3000/locations/${id}`)
        );
        const results = await Promise.all(deleteRequests);

        if (results.every((result) => result.status === 200)) {
          this.successmessage = "All locations have been deleted.";
          this.errormessage = "";
          setTimeout(() => {
            this.$router.push({ name: "home" });
          }, 2000);
        } else {
          this.successmessage = "";
          this.errormessage = "Some locations could not be deleted.";
        }
      } catch (error) {
        console.error("Error deleting locations:", error);
        this.successmessage = "";
        this.errormessage = "Failed to delete locations.";
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin-top: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
}

.text-center {
  text-align: center;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.btn-info {
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-info:hover {
  background-color: #138496;
  border-color: #117a8b;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.alert {
  margin-top: 1rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.375rem;
}
</style>
