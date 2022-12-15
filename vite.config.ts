import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import DefineOptions from 'unplugin-vue-define-options/vite';


export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, './packages/index.ts'),
            name: 'puUI',
            fileName: 'pu-ui'
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
                charset: false,
                // 注入样式变量（根据自己需求注入其他）
                additionalData: '@import "@/style/global.less";',
            },
        },
    },
    plugins: [
        vue(),
        DefineOptions(),
        dts({ include: './packages' }),
    ]
})
