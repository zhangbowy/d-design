import { App } from 'vue'
import PeriodList from './src/index.vue'

(PeriodList as any).install = function (app: App) {
    // 组件注册，按需引入
    app.component((PeriodList as any).name, PeriodList as any)
    return app
}

export default PeriodList
