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

const themelist = ["task-theme-okr", "task-theme-integration",  "task-theme-default"]

const htmlCassName = document.documentElement.className

if (!themelist.some(item => htmlCassName.includes(item))) {
    let c;
    if (trait === 'OKR') {
        c = "task-theme-okr"
    } else if (trait === 'INTE') {
        c = "task-theme-integration"
    } else {
        c = "task-theme-default"
    }
    document.documentElement.className = `${htmlCassName} ${c}`
}
const link1 = document.createElement('link');
link1.setAttribute('rel', 'stylesheet')
link1.setAttribute('href', "//at.alicdn.com/t/c/font_3907746_q0crnxjd0x9.css")
const head = document.getElementsByTagName('head')[0]
head.appendChild(link1)

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
