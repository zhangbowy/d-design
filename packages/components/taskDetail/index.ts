import { App } from 'vue'
import TaskDetail from "./src/components/index/TaskDetail.vue"

(TaskDetail as any).install = function (app: App) {
    // 组件注册，按需引入
    app.component((TaskDetail as any).name, TaskDetail as any)
    return app
}


export { TaskDetail };

export default TaskDetail