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
							<a-button
								v-if="isOperable"
								type="link"
								@click="handleDelCor(item.relevanceId)"
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
				<a-button v-if="isOperable" type="primary" @click="handelAddRelation"
					>添加关联</a-button
				>
			</div>
		</template>
	</a-drawer>
	<Relation
		v-model:visible="show"
		:tabs="['PROJECT', 'OKR']"
		:info="relationInfo"
		@refreshList="initRequest" />
	<!-- <CreateTask
		v-if="createTaskVisible"
		:visible="createTaskVisible"
		:title="'创建任务'"
		:width="780"
		@closeDrawer="createTaskVisible = false"
		@successCreate="handelCreateTaskSuccess" /> -->
</template>

<script setup lang='ts'>
import {computed, reactive, ref} from 'vue';
import {GET_CORRELATION_INFO, DELETE_CORRELATION} from '@/api/api';
import {onMounted} from 'vue';
import {IAllRelationData, InfoList, RelationInfo} from './type';
import {RELATION_TYPE, RELATION_TYPE_TEXT, OKR_PURSUE} from './enum';
import {PlusOutlined} from '@ant-design/icons-vue';
import {message} from 'ant-design-vue';
// import CreateTask from '@/components/createTask/src/components/index/AddTask.vue';

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
			name: '暂无',
			type: 'KR',
			indexId: 1,
			content: 'mock',
			id: 103224,
			sourceType: 'TASK',
			status: 'OKR_PURSUE',
		},
	},
});

const show = ref(false);
const createTaskVisible = ref(false);
const allRelationData = ref<IAllRelationData[]>([]); // 所有关联数据
const relationInfo = reactive<RelationInfo>({
	id: props.info.id,
	relevanceType: props.info.type,
	relevanceCategory: props.info.sourceType,
});
// 初始化数据请求
const initRequest = async () => {
	try {
		const params = {
			bizId: props.info.id,
			relevanceCategory: props.info.sourceType,
			relevanceType: props.info.type,
		};
		const res = await GET_CORRELATION_INFO(params);
		if (res.code == 1) {
			allRelationData.value = res.data;
		}
	} catch (err) {
		console.log('查看关联初始化数据失败：', err);
	}
};
//是否可以操作
const isOperable = computed(() => {
	return (
		props.info.sourceType !== 'OKR' ||
		(props.info.sourceType === 'OKR' && props.info.status !== OKR_PURSUE)
	);
});
// 添加任务
const handelAddTask = () => {
	createTaskVisible.value = true;
};
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
		console.log('移除关联失败：', err);
	}
};

//任务创建成功回调
const handelCreateTaskSuccess = () => {
	createTaskVisible.value = false;
	initRequest();
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

<style lang="less">
.custom-class {
	.ant-drawer-body {
		background-color: #f6f6f6;
		padding: 0;
		position: relative;
	}

	.ant-drawer-header-title {
		width: 100%;
		justify-content: inherit;
		flex-direction: row-reverse;

		.ant-drawer-title {
			flex: initial;
		}
	}
}
</style>
