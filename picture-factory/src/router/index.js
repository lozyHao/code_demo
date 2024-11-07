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
	}
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

export default router;
