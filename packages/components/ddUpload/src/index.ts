import { App } from 'vue'
import DDUpload from "./components/DDUpload.vue"

(DDUpload as any).install = function (app: App) {
    // 组件注册，按需引入
    app.component((DDUpload as any).name, DDUpload as any)
    return app
}


export { DDUpload };

export default DDUpload