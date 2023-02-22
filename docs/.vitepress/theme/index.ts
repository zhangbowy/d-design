import DevUI from 'vue-devui';
import 'vue-devui/style.css';
import '@devui-design/icons/icomoon/devui-icon.css';
// import { ThemeServiceInit, infinityTheme } from 'devui-theme/index.es';
//
// ThemeServiceInit({ infinityTheme }, 'infinityTheme');
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import { registerComponents } from './register-components.js'
import DefaultTheme from 'vitepress/theme'
import {OssUpload} from '../../../dist/pu-ui.es'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(DevUI).use(OssUpload)
    registerComponents(app)
  }
}
