import { createRouter, createWebHistory } from "vue-router";

const routes = [
	{
		path: "/",
		name: "home",
		component: () => import("@/view/Home.vue"),
	}, {
		path: "/import-image",
		name: "importImage",
		component: () => import("@/view/ImportImage.vue"),
	}, {
		path: "/canvas-font",
		name: "canvasFont",
		component: () => import("@/view/CanvasFont.vue"),
	}, {
		path: "/canvas-sign",
		name: "canvasSign",
		component: () => import("@/view/CanvasSign.vue")
	}
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

export default router;
