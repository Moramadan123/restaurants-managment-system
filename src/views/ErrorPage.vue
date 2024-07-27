<template>
  <div>
    <img
      src="../assets/error-rubber-stamp-word-error-inside-illustration-109026446.webp"
      alt=""
    />
  </div>
  <div class="text-center">
    <router-link class="btn btn-info" :to="{ name: 'home' }"
      >Go Home</router-link
    >
  </div>
</template>

<script>
import Navbar from "@/components/Header/Navbar.vue";
export default {
  name: "ErrorPage",
};
Navbar;
</script>

<style scoped>
div {
  display: flex;
  justify-content: center;
}
</style>
