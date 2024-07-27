<template>
  <div class="user-locations">
    <h1 class="page-title">Your Restaurants</h1>
    <table class="table caption-top" v-if="allLocations.length > 0">
      <caption>
        <span class="num">Number of locations: {{ allLocations.length }}</span>
        <span class="float-end">
          <router-link :to="{ name: 'DeleteAllocstions' }">
            <button class="btn btn-danger">Delete All</button>
          </router-link>
        </span>
      </caption>
      <thead>
        <tr class="table-dark">
          <th scope="col">Name</th>
          <th scope="col">Phone</th>
          <th scope="col">Address</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(loc, i) in allLocations" :key="i">
          <td>{{ loc.name }}</td>
          <td>{{ loc.phone }}</td>
          <td>{{ loc.address }}</td>
          <td>
            <router-link
              :to="{ name: 'DeleteLocation', params: { locationId: loc.id } }"
            >
              <button class="btn btn-danger">Delete</button>
            </router-link>
            &nbsp;
            <router-link
              :to="{ name: 'UpdateLocation', params: { locationId: loc.id } }"
            >
              <button class="btn btn-info">Update</button>
            </router-link>
            &nbsp;
            <router-link :to="{ name: 'menu', params: { locationId: loc.id } }">
              <button class="btn btn-success">Menu</button>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="alert alert-warning">No Restaurants Added Yet</div>
  </div>
</template>

<script>
export default {
  name: "UserLocations",
  props: ["allLocations"],
};
</script>

<style>
.user-locations {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa; /* Light background for the content area */
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

.page-title {
  text-align: center;
  color: #343a40; /* Dark gray for the title */
  margin-bottom: 20px;
  font-family: "Arial", sans-serif; /* A clean sans-serif font */
  font-size: 36px;
}

.table {
  width: 100% !important;
  margin-top: 1rem !important;
  background-color: white; /* White background for table */
  border-collapse: separate; /* Adds spacing between borders */
  border-spacing: 0;
  border-radius: 10px;
  overflow: hidden; /* Ensure rounded corners apply */
}

.table th,
.table td {
  border: 1px solid #dee2e6 !important;
  padding: 0.75rem !important;
  text-align: left !important;
  vertical-align: middle !important; /* Center text vertically */
  font-size: 16px; /* Larger font size for readability */
}

.table th {
  background-color: #343a40 !important;
  color: white !important;
  font-weight: 600; /* Bolder text for headers */
}

.table td {
  background-color: #fff;
  color: #333;
  transition: background-color 0.3s; /* Smooth hover effect */
}

.table tbody tr:hover {
  background-color: #f1f1f1; /* Light gray hover effect */
}

.table .btn {
  padding: 0.375rem 0.75rem !important;
  font-size: 14px;
  transition: background-color 0.3s, transform 0.3s; /* Transition for hover effect */
}

.table .btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.table .btn-danger:hover {
  background-color: #c82333;
  transform: scale(1.05); /* Slight grow effect on hover */
}

.table .btn-info {
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.table .btn-info:hover {
  background-color: #138496;
  transform: scale(1.05);
}

.table .btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.table .btn-success:hover {
  background-color: #218838;
  transform: scale(1.05);
}

.alert {
  margin-top: 1rem !important;
  text-align: center !important;
  font-size: 18px;
}

.num {
  background-color: #ddd;
  padding: 10px;
  border-radius: 6px;
  font-weight: bold; /* Make the number bold */
}

/* Remove default link styling */
a {
  text-decoration: none !important;
  color: inherit !important;
}
</style>
