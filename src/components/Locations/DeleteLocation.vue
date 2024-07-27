<template>
  <div class="container">
    <Navbar />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <h1>Delete Restaurant #{{ deletelocation }}</h1>
          <hr />
          <p class="text-danger">
            Are you sure you want to delete this location?
          </p>
          <p v-if="name">{{ name }}</p>
          <p v-if="address">{{ address }}</p>
          <p v-if="phone">{{ phone }}</p>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block px-2">
          <button @click="goback" class="btn btn-info px-2 me-2">
            Go Back
          </button>
          <button @click="deleteRestaurant" class="btn btn-danger px-2">
            Delete Now
          </button>
        </div>
      </div>
      <div
        class="success col-auto d-block mx-auto alert alert-success"
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

export default {
  components: { Navbar },
  name: "DeleteLocation",
  data() {
    return {
      name: "",
      address: "",
      phone: "",
      userId: "",
      deletelocation: "",
      locationdata: [],
      successmessage: "",
      errormessage: "",
      allItemsIdIs: [],
    };
  },
  async mounted() {
    const user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "sign-up" });
    } else {
      this.deletelocation = this.$route.params.locationId;
      this.userId = JSON.parse(user).id;
      this.cancurrentuseraccesslocation();
      let result = await axios.get(
        `http://localhost:3000/items?locId=${this.locationId}`
      );
      console.log(result.data.length);
      let reultength = result.data.length;
      for (let i = 0; i < reultength; i++) {
        this.allItemsIdIs.push(result.data[i].id);
      }
      this.getLocationInfo(this.userId, this.locationId);
    }
    // let resultforcategories = await axios.get(
    //   `http://localhost:3000/categories?locationId=${this.locationId}`
    // );
    // console.log(resultforcategories.data.length);
    // let reultength = resultforcategories.data.length;
    // for (let i = 0; i < reultength; i++) {
    //   this.allCatIdIs.push(resultforcategories.data[i].id);
    // }
    // this.getLocationInfo(this.userId, this.locationId);
  },
  methods: {
    goback() {
      this.$router.push({ name: "home" });
    },
    async cancurrentuseraccesslocation() {
      try {
        const result = await axios.get(
          `http://localhost:3000/locations?id=${this.deletelocation}&userId=${this.userId}`
        );
        if (result.status === 200 && result.data.length > 0) {
          this.locationdata = result.data;
          this.name = this.locationdata[0].name;
          this.address = this.locationdata[0].address;
          this.phone = this.locationdata[0].phone;
        } else {
          this.$router.push({ name: "home" });
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
        this.$router.push({ name: "home" });
      }
    },
    async deleteRestaurant() {
      try {
        const result = await axios.delete(
          `http://localhost:3000/locations/${this.deletelocation}`
        );
        if (result.status === 200) {
          this.successmessage = "Reataurant is deleted correctly";
          setTimeout(() => {
            this.$router.push({ name: "home" });
          }, 2000);
        } else {
          this.successmessage = "Reataurant is deleted correctly";

          console.error("Error deleting the location");
        }
      } catch (error) {
        console.error("Error deleting the location:", error);
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
