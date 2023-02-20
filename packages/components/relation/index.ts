import { App } from 'vue'
import Relation from './src/index.vue'

(Relation as any).install = function (app: App) {
    // 组件注册，按需引入
    app.component((Relation as any).name, Relation as any)
    return app
}
const link1 = document.createElement('link');
link1.setAttribute('rel', 'stylesheet')
link1.setAttribute('href', "//at.alicdn.com/t/c/font_3203338_ownjl40sbzq.css")
const head = document.getElementsByTagName('head')[0]
head.appendChild(link1)

export default Relation
