import { createApp } from "vue";
import "@/assets/style/comment.less";
import App from "./App.vue";
import router from "@/router/index.js";
import { createPinia } from "pinia";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
