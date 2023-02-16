<template>
	<a-drawer
		:visible="visible"
		class="custom-class"
		title="查看关联"
		placement="right"
		:width="780"
		@close="handelClose">
		<div class="content">
			<header>
				<div class="user-info">
					<img v-if="info.avatar" :src="info.avatar" alt="" />
					<span v-else class="nick">{{
						info.name && info.name.substring(0, 1)
					}}</span>
					<div class="info-detail">
						<span class="user-name">{{ info.name }}</span>
						<span class="user-task">{{
							`${info.type}${info.indexId}：${info.content}`
						}}</span>
					</div>
				</div>
			</header>
			<main>
				<div
					class="cor-project"
					v-for="result in allRelationData"
					:key="result.category">
					<span class="project-title"
						>已关联的{{ RELATION_TYPE_TEXT[result.category] }}
						<span v-if="result.category == 'task'">
							<a-button
								type="link"
								@click="handelAddTask"
								class="add-text-color"
								><template #icon><plus-outlined /></template>
								<span class="add-text" style="margin: 0">新建</span></a-button
							></span
						></span
					>
					<div
						class="project-item"
						v-for="item in result.infoList"
						:key="item.id">
						<span class="project-text">{{ item.relevanceName.name }}</span>
						<span class="status-icon" :class="item.relevanceName.status">{{
							RELATION_TYPE[item.relevanceName.status]
						}}</span>
						<div class="item-op">
							<a-button type="link" @click="handleDetail(item, result.category)"
								>查看详情</a-button
							>
							<a-divider style="margin: 0" type="vertical" />
							<a-button type="link" @click="handleDelCor(item.relevanceId)"
								>移除关联</a-button
							>
						</div>
					</div>
				</div>
			</main>
		</div>
		<template #footer>
			<div class="drawer-footer">
				<a-button>关闭</a-button>
				<a-button type="primary" @click="handelAddRelation">添加关联</a-button>
			</div>
		</template>
	</a-drawer>
	<Relation
		v-model:visible="show"
		:tabs="['PROJECT', 'TASK']"
		:info="relationInfo"
		@refreshList="initRequest" />
</template>

<script setup lang='ts'>
import {reactive, ref} from '@vue/reactivity';
import {GET_CORRELATION_INFO, DELETE_CORRELATION} from '@/api/api';
import {onMounted} from '@vue/runtime-core';
import {IAllRelationData, InfoList} from './type';
import {RELATION_TYPE, RELATION_TYPE_TEXT} from './enum';
import {PlusOutlined} from '@ant-design/icons-vue';
import {message} from 'ant-design-vue';

defineOptions({
	name: 'LookRelation',
});
const emit = defineEmits(['lookDetailCallback', 'update:visible']);
const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
	info: {
		type: Object,
		default: {
			avatar:
				'https://static-legacy.dingtalk.com/media/lADPDhmOyroRtzrNArzNArw_700_700.jpg',
			name: '刘恒',
			type: 'KR',
			indexId: 1,
			content: 'mock',
			id: 103224,
			sourceType: 'OKR',
		},
	},
});

const show = ref(false);
const allRelationData = ref<IAllRelationData[]>([]); // 所有关联数据
const relationInfo = reactive({
	id: props.info.id,
	relevanceType: props.info.type,
	relevanceCategory: props.info.sourceType,
});
// 初始化数据请求
const initRequest = async () => {
	const params = {
		bizId: props.info.id,
		relevanceCategory: props.info.sourceType,
		relevanceType: props.info.type,
	};
	const res = await GET_CORRELATION_INFO(params);
	if (res.code == 1) {
		allRelationData.value = res.data;
	}
};
// 添加任务
const handelAddTask = () => {};
// 查看详情
const handleDetail = (item: InfoList, type: String) => {
	emit('lookDetailCallback', item, type);
};
// 移除关联
const handleDelCor = async (id: Number) => {
	try {
		const res = await DELETE_CORRELATION({
			relevanceId: id,
		});
		if (res.code === 1) {
			initRequest();
			message.success('移除关联成功!');
		}
	} catch (err) {
		console.log('err', err);
	}
};

// 关闭弹窗
const handelClose = () => {
	emit('update:visible', false);
};
// 添加关联
const handelAddRelation = () => {
	show.value = true;
};
onMounted(() => {
	initRequest();
});
</script>

<style scoped lang='less'>
@import './index.less';
</style>
