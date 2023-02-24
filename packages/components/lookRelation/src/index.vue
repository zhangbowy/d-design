<template>
	<a-drawer
		:visible="visible"
		class="look-relation-drawer"
		title="查看关联"
		placement="right"
		:width="width"
		@afterVisibleChange="afterVisibleChange"
		@close="handelClose">
		<div class="content">
			<a-spin :spinning="loading">
				<header>
					<div class="user-info">
						<img v-if="info.avatar" :src="info.avatar" alt="" />
						<span v-else class="nick">{{
							info.name && info.name.substring(0, 1)
						}}</span>
						<div class="info-detail">
							<span class="user-name">{{ info.name }}</span>
							<span class="user-task" v-if="info.sourceType == 'OKR'">{{
								`${info.type}${info.indexId}：${info.content}`
							}}</span>
							<span class="user-task" v-else-if="info.sourceType == 'TASK'">{{
								`任务：${info.content}`
							}}</span>
							<span
								class="user-task"
								v-else-if="info.sourceType == 'PROJECT'"
								>{{ `项目：${info.content}` }}</span
							>
						</div>
					</div>
				</header>
				<a-config-provider :locale="zhCN">
					<main>
						<template v-if="allRelationData.length > 0">
							<div
								class="cor-project"
								v-for="result in allRelationData"
								:key="result.category">
								<template v-if="result.infoList.length > 0">
									<span class="project-title"
										>已关联的{{ RELATION_TYPE_TEXT[result.category] }}
										<span v-if="result.category === 'task' && isOperate">
											<a-button
												type="link"
												@click="handelAddTask"
												class="add-text-color"
												><template #icon><plus-outlined /></template>
												<span class="add-text" style="margin: 0"
													>新建</span
												></a-button
											></span
										></span
									>
									<div
										class="project-item"
										v-for="(item, index) in result.infoList"
										:key="item.id">
										<template v-if="result.category === 'OKR'">
											<ul class="kr-style" v-if="item.relevanceType === 'KR'">
												<li>O{{ item.parentSort }}</li>
												<li>KR{{ index + 1 }}</li>
											</ul>
											<span class="o-style" v-else>O{{ item.parentSort }}</span>
										</template>

										<span class="project-text">{{
											item.relevanceName.name
										}}</span>
										<span
											class="status-icon"
											v-if="RELATION_TYPE[item.relevanceName.status]"
											:class="item.relevanceName.status"
											>{{ RELATION_TYPE[item.relevanceName.status] }}</span
										>
										<div class="item-op">
											<a-button
												type="link"
												@click="handleDetail(item, result.category)"
												>查看详情</a-button
											>
											<template v-if="isOperable && item.canDelete">
												<a-divider style="margin: 0" type="vertical" />
												<a-button
													type="link"
													@click="handleDelCor(item.relevanceId)"
													>移除关联</a-button
												>
											</template>
										</div>
									</div>
								</template>
							</div>
						</template>
						<a-empty v-else />
					</main>
				</a-config-provider>
			</a-spin>
		</div>
		<template #footer>
			<div class="drawer-footer">
				<a-button @click="handelClose">关闭</a-button>
				<a-button
					v-if="isSureRelation && isOperate"
					type="primary"
					@click="handelAddRelation"
					>添加关联</a-button
				>
			</div>
		</template>
	</a-drawer>
	<Relation
		v-if="show"
		v-model:visible="show"
		:tabs="tabs"
		:info="relationInfo"
		@refreshList="initRequest" />
	<CreateTask
		v-if="createTaskVisible"
		:visible="createTaskVisible"
		:curUser="user"
		:title="'创建任务'"
		:width="780"
		:trait="trait"
		@closeDrawer="createTaskVisible = false"
		@successCreate="handelCreateTaskSuccess" />
</template>

<script setup lang='ts'>
import {computed, onUpdated, reactive, ref, watch, watchEffect} from 'vue';
import {GET_CORRELATION_INFO, DELETE_CORRELATION} from '@/api/api';
import {onMounted} from 'vue';
import {IAllRelationData, InfoList, RelationInfo} from './type';
import {RELATION_TYPE, RELATION_TYPE_TEXT, OKR_PURSUE} from './enum';
import {PlusOutlined} from '@ant-design/icons-vue';
import {message} from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import CreateTask from '@/components/createTask/src/components/index/AddTask.vue';
import Relation from '@/components/relation/src/index.vue';

defineOptions({
	name: 'LookRelation',
});
const emit = defineEmits([
	'lookDetailCallback',
	'update:visible',
	'refreshList',
]);

const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
	info: {
		type: Object,
		default: {
			avatar: '',
			name: '暂无',
			type: 'TASK_MAIN', // 当前类型
			indexId: 1,
			content: 'mock',
			id: 6071,
			sourceType: 'TASK', // 目标来源   OKR  TASK  PROJECT
			status: '', // 当前O的状态
		},
	},
	tabs: {
		type: Array<'PROJECT' | 'TASK' | 'OKR'>,
		default: [],
		validator: (value: Array<'PROJECT' | 'TASK' | 'OKR'>) => {
			return (
				value.includes('PROJECT') ||
				value.includes('TASK') ||
				value.includes('OKR')
			);
		},
	},
	trait: {
		type: String,
		default: 'OKR',
	},
	zIndex: {
		type: Number,
		default: 1000,
	},
	// 是否可以关联
	isSureRelation: {
		type: Boolean,
		default: true,
	},
	// 页面是否可以操作
	isOperate: {
		type: Boolean,
		default: true,
	},
	width: {
		type: Number,
		default: 780,
	},
});
const user = JSON.parse(localStorage.getItem('QZZ_DATA') || '{}').user;
const show = ref(false);
const loading = ref(true);
const createTaskVisible = ref(false);
const allRelationData = ref<IAllRelationData[]>([]); // 所有关联数据
const relationInfo = computed(
	(): RelationInfo => ({
		id: props.info.id,
		relevanceType: props.info.type,
		relevanceCategory: props.info.sourceType,
	})
);
// 初始化数据请求
const initRequest = async () => {
	loading.value = true;
	try {
		const params = {
			bizId: props.info.id,
			relevanceCategory: props.info.sourceType,
			relevanceType: props.info.type,
		};
		const res = await GET_CORRELATION_INFO(params);
		if (res.code == 1) {
			allRelationData.value = res.data;
			loading.value = false;
		}
	} catch (err) {
		console.log('查看关联初始化数据失败：', err);
		loading.value = false;
	}
};
//是否可以操作
const isOperable = computed(() => {
	return (
		(props.info.sourceType !== 'OKR' && props.isOperate) ||
		(props.info.sourceType === 'OKR' &&
			props.info.status === OKR_PURSUE &&
			props.isOperate)
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
	emit('refreshList');
};
// 添加关联
const handelAddRelation = () => {
	show.value = true;
};
const afterVisibleChange = (visible) => {
	visible && initRequest();
};
</script>

<style scoped lang='less'>
@import './index.less';
</style>

<style lang="less">
.look-relation-drawer {
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
