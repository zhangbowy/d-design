import { App } from 'vue'
import Cycle from './src/index.vue'

(Cycle as any).install = function (app: App) {
    // 组件注册，按需引入
    app.component((Cycle as any).name, Cycle as any)
    return app
}

export default Cycle
