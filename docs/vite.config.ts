import { defineConfig } from 'vite'
import vitePluginAliFlow from "vite-plugin-aliyun-flow";

export default defineConfig({
    plugins: [
        vitePluginAliFlow({ projectName: 'd-design-docs'}),
    ]
})
