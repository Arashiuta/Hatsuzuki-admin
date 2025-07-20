import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "element-plus/dist/index.css";
import { router } from "./router";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { createPinia } from "pinia";
import "@/styles/theme.css";

import hzDocumentFramework from "./components/global/hz-documentFramework/index.vue";
import hzButton from "./components/global/hz-button/index.vue";
import hzPagination from "./components/global/hz-pagination/index.vue";
import hzDeleteDialog from "./components/global/hz-deleteDialog/index.vue";
import hzDialog from "./components/global/hz-dialog/index.vue";

const app = createApp(App);
const pinia = createPinia();

app.component("hz-documentFramework", hzDocumentFramework);
app.component("hz-button", hzButton);
app.component("hz-pagination", hzPagination);
app.component("hz-deleteDialog", hzDeleteDialog);
app.component("hz-dialog", hzDialog);

app.use(router);
app.use(pinia);
app.use(ElementPlus, { locale: zhCn });
app.mount("#app");
