import DevUI from 'vue-devui';
import 'vue-devui/style.css';
import '@devui-design/icons/icomoon/devui-icon.css';
import Antd from 'ant-design-vue';
import "ant-design-vue/dist/antd.less";
// import { ThemeServiceInit, infinityTheme } from 'devui-theme/index.es';
//
// ThemeServiceInit({ infinityTheme }, 'infinityTheme');
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import { registerComponents } from './register-components.js'
import DefaultTheme from 'vitepress/theme'
import { computed, defineAsyncComponent } from 'vue'
import { inBrowser } from 'vitepress'


const link1 = document.createElement('link');
link1.setAttribute('rel', 'stylesheet')
link1.setAttribute('href', "//at.alicdn.com/t/c/font_3907746_q0crnxjd0x9.css")
const head = document.getElementsByTagName('head')[0]
head.appendChild(link1)

const OssUpload = defineAsyncComponent(() => import('../../../dist/pu-ui.es.js').OssUpload)
export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.use(DevUI)
        app.use(Antd)
        if (inBrowser) {
            app.use(OssUpload)
        }
        registerComponents(app)
    }
}
