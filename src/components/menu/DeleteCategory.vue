<template>
  <div class="container">
    <Navbar />
    <form @submit.prevent>
      <div class="text-center">
        <h1 class="category-heading">Delete Category #{{ catId }}</h1>
        <h2 class="category-name">Delete #{{ name }}</h2>
        <hr />
        <p class="warning-text">
          Are you sure you want to delete this Category?
        </p>
        <div class="button-group">
          <button @click="goback" class="btn btn-info">Go Back</button>
          <button @click="DeleteCategory" class="btn btn-danger">
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
  name: "DeleteCategory",
  data() {
    return {
      userId: "",
      successmessage: "",
      errormessage: "",
      locationId: "",
      catId: "",
      name: "",
      allItemsIdIs: [],
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
      await this.getCategoryName();
      let result = await axios.get(
        `http://localhost:3000/items?catId=${this.catId}`
      );
      if (result.status === 200 && result.data.length > 0) {
        this.allItemsIdIs = result.data.map((item) => item.id);
      }
    }
  },
  methods: {
    ...mapMutations([
      "isLoggedinuser",
      "displayAllCategories",
      "canuseraccessthiscategory",
    ]),
    async getCategoryName() {
      try {
        const response = await axios.get(
          `http://localhost:3000/categories?id=${this.catId}&userId=${this.userId}`
        );
        if (response.status === 200 && response.data.length > 0) {
          this.name = response.data[0].name;
        } else {
          this.errormessage = "Category not found.";
        }
      } catch (error) {
        console.error("Error fetching category name:", error);
        this.errormessage = "Error fetching category name.";
      }
    },
    async DeleteCategory() {
      try {
        const response = await axios.delete(
          `http://localhost:3000/categories/${this.catId}`
        );
        let allResult = [];
        for (const itemId of this.allItemsIdIs) {
          try {
            const deleteResponse = await axios.delete(
              `http://localhost:3000/items/${itemId}`
            );
            allResult.push(deleteResponse.status === 200);
          } catch (error) {
            console.error(`Error deleting item ${itemId}:`, error);
            allResult.push(false);
          }
        }
        if (response.status === 200 && !allResult.includes(false)) {
          this.successmessage = "Category deleted successfully";
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
        name: "ViewCategories",
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

.text-center {
  text-align: center;
}

.category-heading {
  font-size: 1.5rem;
  color: #343a40;
}

.category-name {
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
