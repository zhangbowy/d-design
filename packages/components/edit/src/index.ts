import { App } from 'vue'
import Edit from "./components/index.vue"

(Edit as any).install = function (app: App) {
    // 组件注册，按需引入
    app.component((Edit as any).name, Edit as any)
    return app
}


export { Edit };

export default Edit