import { createApp } from "vue";
import { router } from "@/router";
import App from "@/App.vue";
import "@unocss/reset/tailwind.css";
import "uno.css";
const app = createApp(App);
app.use(router);

router.isReady().then(() => {
  const meta = document.createElement("meta");
  meta.name = "naive-ui-style";
  document.head.appendChild(meta);
  app.mount("#app");
});
