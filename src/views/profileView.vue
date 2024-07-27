<template>
  <div class="container">
    <Profilecomp />
  </div>
</template>

<script>
import Profilecomp from "../components/profile/profile.vue"; // Match the case of the file on disk

export default {
  name: "ProfileView",
  components: {
    Profilecomp,
  },
};
</script>

<style>
/* Add your styles here */
</style>
