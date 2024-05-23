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
      {
        path: "canvas-case",
        name: "canvas-case",
        component: () => import("@/views/CanvasCase/CanvasCase.vue"),
      },
      {
        path: "canvas-fireworks",
        name: "canvas-fireworks",
        component: () => import("@/views/CanvasFireworks/CanvasFireworks.vue"),
      },
      {
        path: "chat-room",
        name: "chat-room",
        component: () => import("@/views/ChatRoom/ChatRoom.vue"),
      },
      {
        path: "drawing",
        name: "drawing",
        component: () => import("@/views/canvasDrawing/canvasDrawing.vue"),
      },
      {
        path: "auth-code",
        name: "auth-code",
        component: () => import("@/views/AuthCode/AuthCode.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
