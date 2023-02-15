<template>
	<div>
		<a-table :columns="columns" :data-source="tableData" :scroll="{y: 240}">
			<template #bodyCell="{column, record}">
				<template v-if="column.key === 'status'">
					<span>{{ PROJECT_STATUS[record.status] }}</span>
				</template>
			</template>
		</a-table>
	</div>
</template>

<script setup lang='ts'>
import {debounce} from '@/utils/utils';
import {onMounted, ref, watch} from 'vue';
import {PROJECT_STATUS} from '../../enum';
import {GET_PROJECT} from '@/api/api';

const columns = [
	{
		title: '项目名称',
		key: '1',
		dataIndex: 'projectName',
		width: 150,
	},
	{
		title: '项目状态',
		key: '2',
		dataIndex: 'status',
		width: 150,
	},
];
const props = defineProps({
	okrInfo: {
		type: Object,
		default: {
			okrInfo: {},
		},
	},
});
const curStatus = ref('');
const projectName = ref('');
const tableData = ref([]);
const loading = ref(true);
const multipleTable = ref('');

// 数据请求
const getProjectList = async () => {
	loading.value = true;
	const params = {
		status: curStatus.value,
		bizId: props.okrInfo.id,
		bizType: 'KR',
		ownerId: '',
		projectName: projectName.value,
	};
	const res = await GET_PROJECT(params);
	// if (res.code == 1) {
	// 	tableData.value = res.data;
	// 	loading.value = false;
	// }
};
const searchName = debounce(getProjectList, 500);
watch(projectName, searchName);
watch([curStatus], getProjectList);
onMounted(() => {
	getProjectList();
});
</script>

<style scoped lang='less'>
</style>
