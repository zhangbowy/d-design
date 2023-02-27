import markdown from './markdown';
const lang = {
	'/': {
		'hide-text': '隐藏代码',
		'show-text': '显示代码',
		'copy-button-text': '复制代码片段',
	},
	'/en-US': {
		'hide-text': 'Hide',
		'show-text': 'Expand',
		'copy-button-text': 'Copy',
	},
};

import {defineConfig} from 'vitepress';

export default defineConfig({
	themeConfig: {
        demoblock: lang,
        nav: [
			{
				text: '指南',
				link: '/guide',
			},
			{
				text: '组件',
				link: '/guide',
			},
			{
				text: '资源',
				link: '/source',
			},
			{
				text: 'GitHub',
				link: 'https://github.com/zhangbowy',
			},
		],
		sidebar: sidebarComponent(),
		footer: {
			message: '',
			copyright: 'Copyright © 2023 蒲公英前端团队',
		},

        logo:'./../assets/favicon.ico'
	},
	title: 'D-design',
    favicon: './../assets/favicon.ico',
	description: '蒲公英前端团队开发的ui组件库',
	lastUpdated: true,
	markdown,
	lang,
});

function sidebarComponent() {
	return [
		{
			items: [{text: 'Getting Started', link: '/guide'}],
		},
		{
			text: '基座类',
			items: [
				{text: 'avatar', link: '/components/avatar/index'},
			],
		},
        {
            text: '通用功能',
            items: [
                {text: 'OssUpload', link: '/components/OssUpload/index'},
                {text: 'DDUpload', link: '/components/DDUpload/index'},
                {text: '周期', link: '/components/periodList/index'},
            ],
        },
        {
            text: '一体化（业务组件）',
            items: [
                {text: 'CreateTask', link: '/components/CreateTask/index'},
                {text: 'TaskDetail', link: '/components/TaskDetail/index'},
                {text: 'TaskTrace', link: '/components/TaskTrace/index'},
                {text: 'RenewTask', link: '/components/RenewTask/index'},
                {text: '关联', link: '/components/relation/index'},
                {text: '查看关联', link: '/components/lookRelation/index'},
            ],
        },
	];
}
