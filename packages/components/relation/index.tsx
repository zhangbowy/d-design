import { App } from 'vue'
import Relation from './src/index.vue'

(Relation as any).install = function (app: App) {
    // 组件注册，按需引入
    app.component((Relation as any).name, Relation as any)
    return app
}

export default Relation
