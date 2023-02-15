import { App } from 'vue'
import CreateTask from "./components/index/AddTask.vue"

(CreateTask as any).install = function (app: App) {
    // 组件注册，按需引入
    app.component((CreateTask as any).name, CreateTask as any)
    return app
}


export { CreateTask };

export default CreateTask