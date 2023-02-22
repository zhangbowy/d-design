import { App } from 'vue'
import components from './component'
import util from './utils/index'
import { toggleTheme } from "@zougt/vite-plugin-theme-preprocessor/dist/browser-utils.js";

const trait = sessionStorage.getItem("G_TRAIT") || 'default'

if (trait === 'OKR') {
    toggleTheme({
        scopeName: "task-theme-okr",
    });
} else if (trait === 'INTE') {
    toggleTheme({
        scopeName: "task-theme-integration",
    });
} else {
    toggleTheme({
        scopeName: "task-theme-default",
    });
}

// 所有组件
export * from './component'
// util
export const DUtil = util

// 完整引入组件
const install = function (app: App) {
    components.forEach(component => {
        app.use(component as unknown as { install: () => any })
    })
}

export default {
    install
}
