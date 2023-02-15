import { createApp } from "vue";
// import "./style.css";
import '../packages/style/reset.less'
// import '../dist/style.css'
import 'ant-design-vue/dist/antd.css';
import Antd from 'ant-design-vue';
import App from "./App.vue";
// 完整引入组件库
// import WeDesign from '../packages/index' // 可以配置alias


const app = createApp(App);
app.use(Antd)
// app.use(WeDesign)
// app.use(ChooseUser); // 新增
app.mount("#app");
