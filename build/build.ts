const fs = require('fs');
import path from "path";
import {resolve} from 'path'

const {defineConfig, build} = require('vite');
const vue = require('@vitejs/plugin-vue');
import Components from "unplugin-vue-components/vite"
import {AntDesignVueResolver} from "unplugin-vue-components/resolvers";
import {themePreprocessorPlugin} from "@zougt/vite-plugin-theme-preprocessor/dist/index";
import visualizer from "rollup-plugin-visualizer";
import DefineOptions from 'unplugin-vue-define-options/vite';

const entryDir = path.resolve(__dirname, '../packages/components');
const outputDir = path.resolve(__dirname, '../dist');


const includeStyles = {
    ".ant-btn-link:hover, .ant-btn-link:focus": {
        'border-color': "transparent",
    },
    ".ant-btn-link": {
        background: "transparent"
    },
    ".ant-btn-primary:hover": {
        color: '#ffffff'
    },
    ".ant-checkbox-disabled .ant-checkbox-inner": {
        "background-color": '#f5f5f5'
    },
    ".ant-checkbox-checked": {
        color: '@primary-color'
    },
    ".add-exc-box .ant-modal .ant-modal-content .ant-modal-footer .ant-btn-primary": {
        'border-color': "#d9d9d9",
        "background-color": '#f5f5f5'
    }
};

const baseConfig = defineConfig({
    configFile: false,
    publicDir: false,
    plugins: [
        vue(),
        DefineOptions(),
        Components({
            resolvers: [
                // AntDesignVueResolver({
                //     importStyle: "less",
                // }),
                AntDesignVueResolver()
            ],
        }),
        themePreprocessorPlugin({
            less: {
                multipleScopeVars: [
                    {
                        scopeName: "task-theme-default",
                        path: path.resolve("./packages/assets/style/variables.less"),
                        includeStyles
                    },
                    {
                        scopeName: "task-theme-integration",
                        path: path.resolve(
                            "./packages/assets/style/variablesInte.less"
                        ),
                        includeStyles
                    },
                    {
                        scopeName: "task-theme-okr",
                        path: path.resolve(
                            "./packages/assets/style/OKRvariables.less"
                        ),
                        includeStyles
                    },
                ],
                includeStyleWithColors: [
                    {
                        color: "#ffffff",
                    }
                ],
                defaultScopeName: "task-theme-default",
                extract: false,
                // themeLinkTagInjectTo: "body"
            },
        }),
        // visualizer({
        //     open: true,  //注意这里要设置为true，否则无效
        //     gzipSize: true,
        //     brotliSize: true
        // }),
    ],
    css: {
        preprocessorOptions: {
            less: {
                // modifyVars: {
                //     "primary-color": "#00A48A",
                // },
                javascriptEnabled: true,
                charset: false,
                // 注入样式变量（根据自己需求注入其他）
                additionalData: '@import "@/style/global.less"; @import "@/assets/style/variablesInte.less";',
            },
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, '../packages'), //设置别名
        },
        extensions: ['.js', '.vue', '.json', '.ts'],
    },
});


const rollupOptions = {
    external: ['vue', 'vue-router', '@vueuse/core', '@floating-ui/dom'],
    output: {
        globals: {
            vue: 'Vue',
        },
    },
};

const buildSingle = async (name) => {
    await build(
        defineConfig({
            ...baseConfig,
            build: {
                rollupOptions,
                lib: {
                    entry: path.resolve(entryDir, name),
                    name: 'index',
                    fileName: 'index',
                    formats: ['es', 'umd'],
                },
                outDir: path.resolve(outputDir, name),
            },
        })
    );
};


const components = fs.readdirSync(entryDir).filter((name) => {
    const componentDir = path.resolve(entryDir, name);
    const isDir = fs.lstatSync(componentDir).isDirectory();
    return isDir && fs.readdirSync(componentDir).includes('index.ts');
});


components.forEach(item => {
    buildSingle(item)
})
