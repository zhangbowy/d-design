import LookRelation from './src/index.vue'
import { App } from 'vue'

(LookRelation as any).install = function (app: App) {
    app.component((LookRelation as any).name, LookRelation as any)
    return app
}
export default LookRelation
