import { defineConfig } from 'vite'
import vitePluginAliFlow from "vite-plugin-aliyun-flow";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite"

export default defineConfig({
    plugins: [
        vitePluginAliFlow({ projectName: 'd-design-docs' }),
        Components({
            resolvers: [
                AntDesignVueResolver()
            ],
        }),
    ]
})
