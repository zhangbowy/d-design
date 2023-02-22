import { App } from 'vue'
import components from './component'
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

// 所有组件
export * from './component'



// 完整引入组件
const install = function (app: App) {
    components.forEach(component => {
        app.use(component as unknown as { install: () => any })
    })
}

export default {
    install
}
