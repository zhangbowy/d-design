import { App } from 'vue'
import TaskTrace from "./src/components/index/TaskTrace.vue"

(TaskTrace as any).install = function (app: App) {
    // 组件注册，按需引入
    app.component((TaskTrace as any).name, TaskTrace as any)
    return app
}


export { TaskTrace };

export default TaskTrace