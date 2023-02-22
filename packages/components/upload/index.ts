import { App } from 'vue'
import OssUpload from "./src/components/OssUpload.vue"

(OssUpload as any).install = function (app: App) {
    // 组件注册，按需引入
    app.component((OssUpload as any).name, OssUpload as any)
    return app
}


export { OssUpload };

export default OssUpload