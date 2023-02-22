<template>
	<div class="project-content">
		<div class="table-head">
			<a-select class="project-select" v-model:value="curStatus">
				<a-select-option
					v-for="item in options"
					:key="item.value"
					:value="item.value"
					>{{ item.label }}</a-select-option
				>
			</a-select>
			<a-input
				class="project-input"
				v-model:value="projectName"
				allowClear
				placeholder="搜索项目名称">
				<template #suffix>
					<search-outlined />
				</template>
			</a-input>
		</div>
		<a-table
			:loading="loading"
			:columns="columns"
			:rowKey="(row) => row.projectId"
			:data-source="tableData"
			:rowSelection="rowSelection"
			:pagination="false"
			class="project-table"
			:scroll="{y: 270}">
			<template #bodyCell="{column, record}">
				<template v-if="column.dataIndex === 'status'">
					<span class="default-status" :style="projectStatus[record.status]">{{
						PROJECT_STATUS[record.status]
					}}</span>
				</template>
			</template>
		</a-table>
	</div>
</template>

<script setup lang='ts'>
import {debounce} from '@/utils/utils';
import {computed, onMounted, reactive, ref, toRaw, toRefs, watch} from 'vue';
import {PROJECT_STATUS} from '../../enum';
import {GET_PROJECT} from '@/api/api';
import {ITableColumns, Key} from '../../type';
import {SearchOutlined} from '@ant-design/icons-vue';

const columns = [
	{
		key: '1',
		title: '项目名称',
		dataIndex: 'projectName',
		width: 400,
	},
	{
		key: '2',
		title: '项目状态',
		dataIndex: 'status',
	},
	{
		key: '3',
		title: '负责人',
		dataIndex: 'ownerName',
	},
];
const options = [
	{
		label: '全部状态',
		value: '',
	},
	{
		label: '进行中',
		value: 'underway',
	},
	{
		label: '已归档',
		value: 'closed',
	},
];
const projectStatus = {
	underway: {
		color: '#FF9900',
		backgroundColor: '#FFF5E7',
	},
	closed: {
		color: '#FFFFFF',
		backgroundColor: '#86909c',
	},
};
const props = defineProps({
	info: {
		type: Object,
		default: {
			id: 0,
		},
	},
});
const emit = defineEmits(['handelCheckedCallback']);
const curStatus = ref('');
const projectName = ref('');
const tableData = ref<ITableColumns[]>([]);
const state = reactive({
	loading: true,
	selectedRowKeys: [],
});
const rowSelection = computed(() => ({
	onChange: (selectedRowKeys: Key[]) => {
		state.selectedRowKeys = selectedRowKeys;
		const selectItem = tableData.value.filter(
			(item) => item.link && selectedRowKeys.includes(item.projectId)
		);
		emit('handelCheckedCallback', {
			type: 'PROJECT',
			checkedArr: toRaw(selectItem),
		});
	},
	selectedRowKeys: state.selectedRowKeys,
	getCheckboxProps: (record: ITableColumns) => ({
		disabled: !record.link,
	}),
}));

// 数据请求
const getProjectList = async () => {
	state.loading = true;
	const params = {
		status: curStatus.value,
		bizId: props.info.id,
		bizType: 'KR',
		ownerId: '',
		projectName: projectName.value,
	};
	const res = await GET_PROJECT(params);
	if (res.code == 1) {
		tableData.value = res.data;
		state.selectedRowKeys = res.data
			.filter((item) => !item.link)
			.map((list) => list.projectId);
		state.loading = false;
	}
};
const searchName = debounce(getProjectList, 500);
watch(projectName, searchName);
watch([curStatus], getProjectList);
onMounted(() => {
	getProjectList();
});
const {loading} = toRefs(state);
</script>

<style scoped lang='less'>
@import './index.less';
</style>
