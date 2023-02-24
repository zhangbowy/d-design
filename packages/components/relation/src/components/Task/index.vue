<template>
	<div class="task-wrapper">
		<header>
			<a-select
				v-model:value="curAngle"
				placeholder="请选择"
				popper-class="task-select-popper"
				class="task-select">
				<a-select-option
					v-for="item in options"
					:key="item.value"
					:value="item.value"
					>{{ item.label }}</a-select-option
				>
			</a-select>
			<a-popover trigger="focus" popper-class="task-popover">
				<template #content>
					<ul class="task-sort-ul">
						<li
							@click.stop="selectPopover(item.value)"
							v-for="item in timeOption"
							:key="item.value">
							{{ item.label }}
						</li>
					</ul>
				</template>
				<!-- <profile-outlined class="sort" /> -->
				<!-- <i class="sort iconfont icon-paixu"></i> -->
				<a-button class="sort">
					<template #icon><i class="iconfont icon-paixu"></i></template>
				</a-button>
			</a-popover>
			<a-input
				v-model:value="taskName"
				class="task-input"
				placeholder="搜索任务名称"
				allowClear>
				<template #suffix> <search-outlined /> </template
			></a-input>
		</header>
		<main>
			<a-table
				class="task-table"
				:loading="loading"
				:columns="columns"
				:rowKey="(row) => row.id"
				:data-source="tableData"
				:rowSelection="rowSelection"
				:pagination="{
					showQuickJumper: true,
					defaultPageSize: pagination.pageSize,
					total: pagination.totalNum,
					showSizeChanger: true,
					pageSizeOptions: ['10', '20', '50', '100'],
					current: pagination.current,
					onChange: paginationChange,
				}"
				:scroll="{y: 240}">
				<template #bodyCell="{column, record}">
					<template v-if="column.dataIndex === 'content'">
						<span>
							{{ record.content }}
							<span class="extend-style" v-if="record.isExtend">继承</span>
						</span>
					</template>
					<template v-if="column.dataIndex === 'status'">
						<span class="default-status" :style="taskStatus[record.status]">{{
							taskStatusEnum[record.status]
						}}</span>
					</template>
				</template>
			</a-table>
		</main>
	</div>
</template>

<script setup lang='ts'>
import {ref, watch, computed, reactive, toRaw, toRefs, onMounted} from 'vue';
import {GET_TASK_LIST} from '@/api/api';
import {taskStatusEnum} from '../../enum';
import {debounce} from '@/utils/utils';
import {SearchOutlined} from '@ant-design/icons-vue';
import {ITaskTableColumns, Key} from '../../type';

const props = defineProps({
	info: {
		type: Object,
		default: {
			id: 0,
		},
	},
	defaultChecked: {
		type: Array,
		default: [],
	},
});
const emit = defineEmits(['handelCheckedCallback', 'handelRelationCallback']);
const options = [
	{
		label: '全部状态',
		value: 'ALL',
	},
	{
		label: '创建人',
		value: 'CREATE',
	},
	{
		label: '负责人',
		value: 'PRINCIPAL',
	},
	{
		label: '执行人',
		value: 'EXECUTE',
	},
];
const timeOption = [
	{
		label: '默认排序',
		value: 'DEFAULT_SORT',
	},
	{
		label: '创建时间近到远',
		value: 'CREATE_DESC',
	},
	{
		label: '创建时间远到近',
		value: 'CREATE_ASC',
	},
	{
		label: '截止时间近到远',
		value: 'ABORT_DESC',
	},
	{
		label: '截止时间远到近',
		value: 'ABORT_ASC',
	},
];
const taskStatus = {
	PROCESS: {
		color: '#595959',
		backgroundColor: '#F6F6F6',
	},
	NOT_BEGIN: {
		color: '#595959',
		backgroundColor: '#F6F6F6',
	},
	DONE: {
		color: '#00CC66',
		backgroundColor: '#E8FFEA',
	},
	TERMINATION: {
		color: '#FFFFFF',
		backgroundColor: '#86909C ',
	},
};

const columns = [
	{
		title: '任务名称',
		dataIndex: 'content',
		width: 700,
	},
	{
		title: '任务状态',
		dataIndex: 'status',
	},
];
const tableData = ref([]);
const filterContent = reactive({
	curAngle: 'ALL',
	taskName: '',
	curSort: 'DEFAULT_SORT',
});
const state = reactive({
	loading: true,
	selectedRowKeys: [],
});
const pagination = reactive({
	totalNum: 0,
	current: 1,
	pageSize: 10,
});
const rowSelection = computed(() => ({
	onChange: (selectedRowKeys: Key[]) => {
		state.selectedRowKeys = selectedRowKeys;
		const selectItem = tableData.value.filter(
			(item) => item.link && selectedRowKeys.includes(item.id)
		);
		emit('handelCheckedCallback', {
			type: 'TASK',
			checkedArr: toRaw(selectItem),
		});
	},
	selectedRowKeys: state.selectedRowKeys,
	getCheckboxProps: (record: ITaskTableColumns) => ({
		disabled: !record.link,
	}),
}));
const paginationChange = (page: number, pageSize: number) => {
	pagination.current = page;
	pagination.pageSize = pageSize;
};
// 数据请求
const getTaskList = async () => {
	state.loading = true;
	const params = {
		sort: filterContent.curSort,
		bizId: props.info.id,
		curPage: pagination.current,
		angle: filterContent.curAngle,
		fuzzy: filterContent.taskName,
		pageSize: pagination.pageSize,
		relevanceCategory: 'OKR',
		relevanceType: 'KR',
	};
	const res = await GET_TASK_LIST(params);
	if (res.code == 1) {
		tableData.value = res.data.resultList;
		const disableId = res.data.resultList
			.filter((item) => !item.link)
			.map((list) => list.id);
		state.selectedRowKeys = [...disableId, ...(props.defaultChecked as Key[])];
		state.loading = false;
		pagination.totalNum = res.data.totalItem;
	}
};
//popover点击
const selectPopover = (val) => {
	filterContent.curSort = val;
};
const searchName = debounce(getTaskList, 500);

// onMounted(() => {
// 	getTaskList();
// 	//   getTaskCount();
// });

watch(
	[
		() => filterContent.curAngle,
		() => filterContent.curSort,
		() => pagination.current,
		() => pagination.pageSize,
	],
	() => {
		getTaskList();
	},
	{
		immediate: true,
	}
);
watch(() => filterContent.taskName, searchName);
const {loading} = toRefs(state);
const {curAngle, taskName} = toRefs(filterContent);
</script>

<style scoped lang='less'>
@import './index.less';
</style>
