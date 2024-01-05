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
      {
        path: "video-mosaic",
        name: "video-mosaic",
        component: () => import("@/views/VideoMosaic/VideoMosaic.vue"),
      },
      {
        path: "video-snapshot",
        name: "video-snapshot",
        component: () => import("@/views/VideoSnapshot/VideoSnapshot.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
