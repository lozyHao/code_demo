import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/canvas-track",
    name: "canvas-track",
    component: () => import("@/views/CanvasTrack.vue"),
  },
  {
    path: "/canvas-track-optimize-one",
    name: "canvas-track-optimize-one",
    component: () => import("@/views/CanvasTrackOptimizeOne.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
