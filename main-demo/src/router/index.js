import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/LayOut.vue"),
    redirect: "home",
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/Home.vue"),
      },
      {
        path: "canvas-track",
        name: "canvas-track",
        component: () => import("@/views/CanvasTrack/CanvasTrack.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
