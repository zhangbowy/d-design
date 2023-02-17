import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from "unplugin-vue-components/vite"
import path from "path";
import { resolve } from 'path'
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import { themePreprocessorPlugin } from "@zougt/vite-plugin-theme-preprocessor";
import dts from 'vite-plugin-dts'
import DefineOptions from 'unplugin-vue-define-options/vite';


export default defineConfig({
    server: {
        host: "localhost",
        hmr: true,
        open: true,
        cors: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        },
        proxy: {
            "/api": {
                target: "http://daily-assign.sunmeta.top",
                changeOrigin: true,
            },
        },
    },
    build: {
        lib: {
            entry: resolve(__dirname, './packages/index.ts'),
            name: 'pu-ui',
            fileName: (format) => `pu-ui.${format}.js`,
            formats: ['es', 'umd'],
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'packages'), //设置别名
        },
        extensions: ['.js', '.vue', '.json', '.ts'],
    },
    css: {
        preprocessorOptions: {
            less: {
                // modifyVars: {
                //     "primary-color": "#00A48A",
                // },
                javascriptEnabled: true,
                charset: false,
                // 注入样式变量（根据自己需求注入其他）
                additionalData: '@import "@/style/global.less";',
            },
        },
    },
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    // 将所有带短横线的标签名都视为自定义元素
                    isCustomElement: (tag) => tag === "iconpark-icon",
                },
            },
        }),
        DefineOptions(),
        Components({
            resolvers: [
                // AntDesignVueResolver({
                //     importStyle: "less",
                // }),
                AntDesignVueResolver()
            ],
        }),
        dts({ include: './packages' }),
        themePreprocessorPlugin({
            less: {
                multipleScopeVars: [
                    {
                        scopeName: "task-theme-default",
                        path: path.resolve("./packages/assets/style/variables.less"),
                    },
                    {
                        scopeName: "task-theme-integration",
                        path: path.resolve(
                            "./packages/assets/style/variablesInte.less"
                        ),
                    },
                    {
                        scopeName: "task-theme-okr",
                        path: path.resolve(
                            "./packages/assets/style/OKRvariables.less"
                        ),
                    },
                ],
                defaultScopeName: "task-theme-default",
                extract: false,
                // themeLinkTagInjectTo: "body"
            },
        }),
    ]
})
