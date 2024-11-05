import { createWebHistory, createRouter } from "vue-router";

const routers = [
	{
		path: "/",
		name: "home",
		component: () => import("../views/HomeView.vue"),
	}
]


const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: routers
});

export default router;