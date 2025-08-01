import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "element-plus/dist/index.css";
import { router } from "./router";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { createPinia } from "pinia";
import "@/styles/theme.css";

import hzTableFramework from "./components/global/hz-tableFramework/index.vue";
import hzButton from "./components/global/hz-button/index.vue";
import hzPagination from "./components/global/hz-pagination/index.vue";
import hzDialog from "./components/global/hz-dialog/index.vue";

const app = createApp(App);
const pinia = createPinia();

app.component("hz-table-framework", hzTableFramework);
app.component("hz-button", hzButton);
app.component("hz-pagination", hzPagination);
app.component("hz-dialog", hzDialog);

app.use(router);
app.use(pinia);
app.use(ElementPlus, { locale: zhCn });
app.mount("#app");
