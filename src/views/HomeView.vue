<template>
  <div class="container">
    <Navbar />
    <div class="header">
      <p class="welcome-text text-end">Welcome, {{ username }}</p>
      <div class="links">
        <router-link :to="{ name: 'profile' }">
          <button class="btn btn-info" type="button">Profile</button>
        </router-link>
        <router-link :to="{ name: 'AddNewLocation' }">
          <button type="button" class="btn btn-primary">
            Add New Restaurant
          </button>
        </router-link>
      </div>
    </div>
    <UserLocations :allLocations="listodLocations" />
  </div>
</template>
<script>
import Navbar from "../components/Header/Navbar.vue";
import { mapActions } from "vuex";
import UserLocations from "../components/Locations/UserLocations.vue";
import axios from "axios";
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  components: { Navbar, UserLocations },
  name: "HomeView",
  data() {
    return {
      username: "",
      listodLocations: [],
      userId: "",
    };
  },

  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "signup" });
    } else {
      this.username = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
    }
    let result = await axios.get(
      `http://localhost:3000/locations?userId=${this.userId}`
    );
    if (result.status == 200 && result.data.length > 0) {
      console.log(result.data);
      this.listodLocations = result.data;
    }
  },
  methods: {
    ...mapActions(["redirectTo"]), // Corrected typo here
  },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-text {
  font-size: 1.25rem;
  font-weight: bold;
  color: #343a40;
  align-items: center;
}

.btn {
  padding: 10px 20px;
  font-size: 1rem;
  margin-left: 10px;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
  width: 190px;
  height: 50px;
  &:hover {
    background-color: #0056b3;
    border-color: #004085;
  }
}
.links {
  display: flex;
  align-items: center;
}
.btn-info {
  background-color: #17a2b8;
  border-color: #17a2b8;
  color: white;
  height: 50px;

  &:hover {
    background-color: #117a8b;
    border-color: #0e5c6b;
  }
}
html,
body {
  width: 100% !important;
  margin: 0;
  padding: 0;
}

.full-width {
  width: 100%;
}
</style>
