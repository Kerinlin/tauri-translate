import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/home/index.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
