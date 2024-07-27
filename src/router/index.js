import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignUp from "../views/SignUp.vue";
import Login from "../views/Login.vue";
import Profile from "../views/profileView.vue";
import updateProfile from "../components/profile/updateprofile.vue";
import ErrorPage from "../views/ErrorPage.vue";
import AddNewLocation from "../components/Locations/AddNewLocation.vue";
import DeleteLocation from "../components/Locations/DeleteLocation.vue";
import DeleteAllocstions from "../components/Locations/DeleteAllocstions.vue";
import UpdateLocation from "../components/Locations/UpdateLocation.vue";
import menu from "../components/menu/menu.vue";
import AddNewCategiry from "../components/menu/AddNewCategiry.vue";
import ViewCategories from "../components/menu/ViewCategories.vue";
import UpdateCategory from "../components/menu/UpdateCategory.vue";
import DeleteCategory from "../components/menu/DeleteCategory.vue";
import DeleteAllCategory from "../components/menu/DeleteAllCategory.vue";
import AddNewItems from "../components/menu/AddNewItems.vue";
import updateItem from "../components/menu/updateItem.vue";
import DeleteItem from "../components/menu/DeleteItem.vue";
import DeleteAllItems from "../components/menu/DeleteAllItems.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { title: "The Home Page" },
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
    meta: { title: "About Page" },
  },
  {
    path: "/sign-up",
    name: "sign-up",
    component: SignUp,
    meta: { title: "Sign up Page" },
  },
  {
    path: "/log-in",
    name: "login", // Adjusted to lowercase for consistency
    component: Login,
    meta: { title: "login Page" },
  },
  {
    path: "/profile",
    name: "profile", // Adjusted to lowercase for consistency
    component: Profile,
    meta: { title: "Profile Page" },
  },
  {
    path: "/updateProfile",
    name: "updateProfile", // Adjusted to lowercase for consistency
    component: updateProfile,
    meta: { title: "Update Profile page" },
  },
  {
    path: "/AddNewLocation",
    name: "AddNewLocation", // Adjusted to lowercase for consistency
    component: AddNewLocation,
    meta: { title: "Adding new Location PAGE" },
  },
  {
    path: "/Delete-Location/:locationId",
    name: "DeleteLocation", // Adjusted to lowercase for consistency
    component: DeleteLocation,
    meta: { title: "Delete Page" },
  },
  {
    path: "/UpdateLocation/:locationId",
    name: "UpdateLocation", // Adjusted to lowercase for consistency
    component: UpdateLocation,
    meta: { title: "UpdateLocation Page" },
  },
  {
    path: "/DeleteAllocstions",
    name: "DeleteAllocstions", // Adjusted to lowercase for consistency
    component: DeleteAllocstions,
    meta: { title: " DeleteAllocstions" },
  },
  {
    path: "/menu/categories/add/:locationId",
    name: "AddNewCategiry",
    component: AddNewCategiry,
    meta: { title: " AddNewCategiry page" },
  },
  {
    path: "/menu/categories/update/:locationId/:catId",
    name: "UpdateCategory",
    component: UpdateCategory,
    meta: { title: " UpdateCategory page" },
  },
  {
    path: "/menu/categories/delete/loc/:locationId/item/:catId",
    name: "DeleteCategory",
    component: DeleteCategory,
    meta: { title: " DeleteCategory page" },
  },
  {
    path: "/menu/categories/:locationId",
    name: "DeleteAllCategory",
    component: DeleteAllCategory,
    meta: { title: "DeleteAllCategory page" },
  },

  {
    path: "/menu/locations/:locationId",
    name: "menu",
    component: menu,
    meta: { title: " menu page" },
  },
  {
    path: "/menu/categories/view/:locationId",
    name: "ViewCategories",
    component: ViewCategories,
    meta: { title: " ViewCategories page" },
  },
  {
    path: "/menu/AddNewItems/view/loc/:locationId",
    name: "AddNewItems",
    component: AddNewItems,
    meta: { title: " AddNewItems page" },
  },
  {
    path: "/update/:locationId/:itemId",
    name: "updateItem",
    component: updateItem, // ensure this is correct
  },
  {
    path: "/delete/:locationId/:itemId",
    name: "DeleteItem",
    component: DeleteItem,
    meta: { title: " DeleteItem page" },
  },
  {
    path: "/delete-all/:locationId",
    name: "DeleteAllItems",
    component: DeleteAllItems,
    meta: { title: "DeleteAllItems" },
  },
  //state last
  {
    path: "/:catchall(.*)",
    name: "ErrorPage", // Adjusted to lowercase for consistency
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Use the beforeEach hook to set the document title
router.beforeEach((to, from, next) => {
  const defaultTitle = "Unknown page";
  document.title = to.meta.title || to.name || defaultTitle;
  next();
});

export default router;
