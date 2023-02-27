import DevUI from 'vue-devui';
import 'vue-devui/style.css';
import '@devui-design/icons/icomoon/devui-icon.css';
import '../../../dist/style.css'
// import "ant-design-vue/dist/antd.less";
// import { ThemeServiceInit, infinityTheme } from 'devui-theme/index.es';
//
// ThemeServiceInit({ infinityTheme }, 'infinityTheme');
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import { registerComponents } from './register-components.js'
import DefaultTheme from 'vitepress/theme'
import { computed, defineAsyncComponent } from 'vue'
import { inBrowser } from 'vitepress'
// const Ddesign = defineAsyncComponent(() => import('../../../dist/pu-ui.es.js'))
// import  Ddesign from '../../../dist/pu-ui.es.js'
// const Ddesign = import('../../../dist/pu-ui.es.js')

export default {
    ...DefaultTheme,
    enhanceApp({Vue, app }) {
        app.use(DevUI)
        // app.use(Ddesign)
        // Ddesign = import('../../../dist/pu-ui.es.js').then(m => {
        // })
        registerComponents(app)
    }
}
