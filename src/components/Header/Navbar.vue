<template>
  <ul class="navbar">
    <li>
      <router-link :to="{ name: 'home' }" exact>Home</router-link>
    </li>
    <li>
      <a @click="logmeout" href="#">Logout</a>
    </li>
  </ul>
</template>

<script>
export default {
  name: "nav-bar",
  methods: {
    logmeout() {
      localStorage.clear();
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style lang="scss" scoped>
$fontColor: #343a40; /* Dark color for links */
$navColor: #525a5a; /* Navigation hover color */
$highlightColor: #007bff; /* Blue highlight for active links */

.navbar {
  display: flex;
  justify-content: center;
  list-style: none;
  margin-bottom: 30px;
  background-color: #f8f9fa; /* Light background color */
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */

  li {
    margin: 0 15px; /* Add some margin between list items */

    a {
      text-decoration: none;
      font-weight: bold;
      color: $fontColor;
      padding: 10px 15px;
      transition: color 0.3s, background-color 0.3s; /* Smooth transition */
      border-radius: 4px; /* Rounded corners for hover effect */

      &:hover {
        color: white;
        background-color: $highlightColor; /* Blue background on hover */
      }

      &.router-link-exact-active {
        color: white;
        background-color: $highlightColor; /* Blue background for active link */
      }
    }
  }
}
</style>
