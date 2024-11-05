import { createWebHashHistory, createRouter } from "vue-router";

const routers = [
	{
		path: "/",
		name: "home",
		component: () => import("../views/HomeView.vue"),
	}, {
		path: "/about",
		name: "about",
		component: () => import("../views/AboutView.vue"),
	}
]


const router = createRouter({
	history: createWebHashHistory(),
	routes: routers
});

export default router;