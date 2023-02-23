import DevUI from 'vue-devui';
import 'vue-devui/style.css';
import '@devui-design/icons/icomoon/devui-icon.css';
// import { ThemeServiceInit, infinityTheme } from 'devui-theme/index.es';
//
// ThemeServiceInit({ infinityTheme }, 'infinityTheme');
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import { registerComponents } from './register-components.js'
import DefaultTheme from 'vitepress/theme'
import { computed, defineAsyncComponent } from 'vue'
import { inBrowser } from 'vitepress'

const OssUpload = defineAsyncComponent(() => import('../../../dist/pu-ui.es.js').OssUpload)
export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(DevUI)
    if(inBrowser) {
      app.use(OssUpload)
    }
    registerComponents(app)
  }
}
