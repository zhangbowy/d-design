import { App } from 'vue'
import RenewTask from "./src/components/RenewTask.vue"

(RenewTask as any).install = function (app: App) {
    // 组件注册，按需引入
    app.component((RenewTask as any).name, RenewTask as any)
    return app
}


export { RenewTask };

export default RenewTask