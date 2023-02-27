<template>
	<a-modal
		:visible="visible"
		:title="title"
		@ok="handleOk"
		:width="980"
		cancelText="取消"
		okText="确定"
		class="relation-wrapper"
		@cancel="handelCancel"
		:confirmLoading="confirmLoading"
		centered>
		<header v-if="showTab">
			<a-radio-group v-model:value="curTab">
				<a-radio-button
					class="radio-btn"
					v-for="item in tabs"
					:key="item"
					:value="item">
					<i :class="`iconfont ${TABS_ENUM_ICON[item]}`"></i>
					{{ TABS_ENUM[item] }}
				</a-radio-button>
			</a-radio-group>
		</header>
		<a-config-provider :locale="zhCN">
			<main>
				<Okr
					@handelCheckedCallback="handelCheckedCallback"
					v-if="tabs.includes('OKR')"
					:info="info"
					:curPeriodId="curPeriodId"
					:defaultChecked="defaultChecked.okrDefaultCheck"
					v-show="curTab == 'OKR'" />
				<Project
					v-if="tabs.includes('PROJECT')"
					:info="info"
					v-show="curTab == 'PROJECT'"
					:defaultChecked="defaultChecked.projectDefaultCheck"
					@handelCheckedCallback="handelCheckedCallback" />
				<Task
					v-if="tabs.includes('TASK')"
					:info="info"
					v-show="curTab == 'TASK'"
					:defaultChecked="defaultChecked.taskDefaultCheck"
					@handelCheckedCallback="handelCheckedCallback" />
			</main>
		</a-config-provider>
	</a-modal>
</template>

<script setup lang='ts'>
import {ref, watch} from 'vue';
import {TABS_ENUM} from './enum';
import {ADD_RELATION, ADD_OKR_RELATION} from '@/api/api';
import Project from './components/Project/index.vue';
import Task from './components/Task/index.vue';
import Okr from './components/Okr/index.vue';
import {relevanceType, reverseTabEnum, TABS_ENUM_ICON} from './enum';
import {message} from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import {ICheckedCallback, OperationType, RelevanceType} from './type';
import mitt from '@/utils/eventBus';
defineOptions({
	name: 'Relation',
});
const emit = defineEmits([
	'update:visible',
	'refreshList',
	'successCallback',
	'close',
]);
const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
	// 显示那些tab
	tabs: {
		type: Array<'PROJECT' | 'TASK' | 'OKR'>,
		require: true,
		default: [],
		validator: (value: Array<'PROJECT' | 'TASK' | 'OKR'>) => {
			return (
				value.includes('PROJECT') ||
				value.includes('TASK') ||
				value.includes('OKR')
			);
		},
	},
	// 关联的源信息
	info: {
		type: Object,
		require: true,
		default: {
			id: 0,
			relevanceType: '',
			relevanceCategory: '',
		},
	},
	// 确定是否调用接口
	isDirectAdd: {
		type: Boolean,
		default: true,
	},
	// title
	title: {
		type: String,
		default: '添加关联',
	},
	// 是否显示tabs
	showTab: {
		type: Boolean,
		default: true,
	},
	// 默认勾选
	defaultChecked: {
		type: Object,
		default: {
			okrDefaultCheck: [],
			taskDefaultCheck: [],
			projectDefaultCheck: [],
		},
	},
	// 周期id
	curPeriodId: {
		type: String,
		default: '',
	},
	zIndex: {
		type: Number,
		default: 1000,
	},
});

const curTab = ref(props.tabs[0]);
const confirmLoading = ref(false);
const allRelation = ref({});
// check的回调
const handelCheckedCallback: ICheckedCallback = (val) => {
	allRelation.value[val.type] = val.checkedArr;
};
// 成功回调
const handleOk = async () => {
	confirmLoading.value = true;
	const formatArr = Object.keys(allRelation.value)
		.filter((item) => allRelation.value[item as OperationType].length > 0)
		.map((item) => {
			const objArr = allRelation.value[item as OperationType].map((list) => ({
				id: list.id || list.projectId,
				relevanceType: relevanceType[list.type as RelevanceType] || 'PROJECT',
				relevanceCategory: item,
			}));
			return objArr;
		});
	const params = {
		sourceInfo: {
			id: props.info.id,
			relevanceType: props.info.relevanceType,
			relevanceCategory: props.info.relevanceCategory,
		},
		targetInfo: formatArr.flat(Infinity),
		relevanceSource: 'ADD',
	};
	if (!props.isDirectAdd) {
		emit('successCallback', params);
		confirmLoading.value = false;
		emit('update:visible', false);
		return;
	}
	const res = await ADD_RELATION(params);
	if (res.code == 1) {
		message.success('关联成功!');
		emit('refreshList');
	}
	confirmLoading.value = false;
	emit('update:visible', false);
};
// 关闭弹窗
const handelCancel = () => {
	emit('update:visible', false);
	emit('close');
	allRelation.value = {};
};
watch(
	() => props.visible,
	() => {
		if (props.visible) {
			props.tabs.includes('OKR') &&
				mitt.emit('updateOkrCheck', props.defaultChecked.okrDefaultCheck);
			props.tabs.includes('PROJECT') &&
				mitt.emit('updateProjectCheck', props.defaultChecked.taskDefaultCheck);
			props.tabs.includes('TASK') &&
				mitt.emit('updateTaskCheck', props.defaultChecked.projectDefaultCheck);
		}
	}
);
</script>

<style scoped lang='less'>
@import './index.less';
</style>
<style lang="less">
.relation-wrapper {
	width: 100%;

	.ant-modal-body {
		padding: 0;
	}
}
</style>
