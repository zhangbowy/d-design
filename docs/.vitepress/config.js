import markdown from './markdown'
const lang = {
    '/': {
        'hide-text': '隐藏代码',
        'show-text': '显示代码',
        'copy-button-text': '复制代码片段'
    },
    '/en-US': {
        'hide-text': 'Hide',
        'show-text': 'Expand',
        'copy-button-text': 'Copy'
    }
}

import { defineConfig } from 'vitepress'

export default defineConfig({
    themeConfig: {
        nav: [
            {
                text: '指南',
                link: '/guide',
            },
            {
                text: '组件',
                link: '/components/',
            },
            {
                text: '资源',
                link: '/source',
            },
            {
                text: 'GitHub',
                link: 'https://github.com/lxKylin/vitepressdemo',
            },
        ],
        sidebar: sidebarComponent()
    },
    title: 'd-design',
    description: '222',
    markdown,
    lang
})


function sidebarComponent() {
    return [
        {
            text: '组件列表',
            items: [
                { text: 'avatar', link: '/components/avatar/index' },
                { text: 'Getting Started', link: '/getting-started' },
            ]
        }
    ]
}
