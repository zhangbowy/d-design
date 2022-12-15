import { App } from 'vue'
import Avatar from './src/index.vue'





export type { AvatarProps } from './src/type';




(Avatar as any).install = function (app: App) {
    // 组件注册，按需引入
    app.component((Avatar as any).name, Avatar as any)
    return app
}


export { Avatar };

export default Avatar
