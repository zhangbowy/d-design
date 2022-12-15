import ChooseU from './components/index.vue';
import { createApp } from 'vue';
// 使用vue3的createApp,以及mount,unmount方法创建挂载实例
interface Options {
    visible?: boolean
}
export default function ChooseUser(options: Options = {}) {
    // 创建一个节点，并将组件挂载上去
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)
    const app = createApp(ChooseU, {
        ...options, visible: true, remove() {
            // @ts-ignore
            app.unmount(mountNode) //创建完后要进行销毁
            document.body.removeChild(mountNode)
        }
    })
    return app.mount(mountNode)
}

