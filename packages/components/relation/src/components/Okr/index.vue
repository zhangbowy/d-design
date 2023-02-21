<template>
	<div class="okr-relation-wrapper">
		<header>
			<PeriodList
				id="myokr-period"
				:all="false"
				@updatePeriodInfo="queryOKRByUserId"
				icon="qzz_icon_guize1">
				<template #rightIcon>
					<profile-outlined />
				</template>
			</PeriodList>
		</header>
		<main>
			<template v-if="okrData.length > 0">
				<a-checkbox-group
					v-model:value="checkList"
					@change="handelCheckboxChange">
					<template v-for="(item, index) in okrData" :key="item.id">
						<a-checkbox :value="item.id" :disabled="item?.disabled">
							<span class="O">O{{ item.importance }}</span>
							<span>{{ item.content }} </span>
						</a-checkbox>
						<div class="kr-checkbox">
							<a-checkbox
								v-for="(list, idx) in item.keyResults"
								:disabled="list?.disabled"
								:key="list.id"
								class="cur-checkbox"
								:value="list.id">
								<span class="KR">KR{{ idx + 1 }}</span>
								<span>{{ list.content }} </span>
							</a-checkbox>
						</div>
						<a-divider v-if="index !== okrData.length - 1" />
					</template>
				</a-checkbox-group>
			</template>

			<a-empty
				v-else
				description="暂无数据"
				image="https://qzz-material.forwe.store/img/okr_backstage/1b5799a9470647498b42e88d2681a9be.png"
				:image-style="{
					height: '230px',
				}">
			</a-empty>
		</main>
	</div>
</template>

<script setup lang='ts'>
import PeriodList from '@/components/periodList/src/index.vue';
import {GET_OKRLIST_BY_USERID, GET_CORRELATION_INFO} from '@/api/api';
import {onMounted, ref, toRaw} from 'vue';
import {ProfileOutlined} from '@ant-design/icons-vue';

const okrData = ref([]);
const checkList = ref([]);
const loading = ref(true);
const props = defineProps({
	bizId: {
		type: Number,
		default: 0,
	},
	relevanceType: {
		type: String,
		default: 'PROJECT',
	},
});
const emit = defineEmits(['handelRelationCallback', 'handelCheckedCallback']);
// 周期改变
const queryOKRByUserId = (info: {curPeriodId: string}) => {
	getOkrList(info.curPeriodId);
};
// 获取列表
const getOkrList = async (periodId?: string) => {
	loading.value = true;

	const params = {
		periodId,
		processStatus: 'OKR_PURSUE',
		curPage: 1,
		pageSize: 1000,
	};
	const res = await GET_OKRLIST_BY_USERID(params);
	if (res.code == 1) {
		okrData.value = res.data;
		loading.value = false;
	}
	if (props.bizId) {
		const relationParams = {
			bizId: props.bizId,
			relevanceCategory: props.relevanceType,
			relevanceType: props.relevanceType,
		};
		const result = await GET_CORRELATION_INFO(relationParams);
		if (result.code == 1 && result.data.length > 0) {
			const relationIdArr = result.data
				.filter((item) => item.category == 'OKR')[0]
				.infoList.map((list) => Number(list.id));
			checkList.value = relationIdArr;
			okrData.value.forEach((item) => {
				if (relationIdArr.includes(item.id)) {
					item.disabled = true;
				}
				item.keyResults.forEach((list) => {
					relationIdArr.includes(list.id) && (list.disabled = true);
				});
			});
		}
	}
};
// checkChange
const handelCheckboxChange = (e: number[]) => {
	const arr = [];
	okrData.value.forEach((item) => {
		if (!item.disabled && e.includes(item.id)) {
			item.type = 'O';
			arr.push(toRaw(item));
		}
		item.keyResults.forEach((list) => {
			if (!list.disabled && e.includes(list.id)) {
				list.type = 'KR';
				arr.push(toRaw(list));
			}
		});
	});
	emit('handelCheckedCallback', {
		type: 'OKR',
		checkedArr: arr,
	});
};
onMounted(() => {
	getOkrList();
});
</script>

<style scoped lang='less'>
@import './index.less';
</style>
