<template>
	<div class="okr-relation-wrapper">
		<header>
			<PeriodList
				id="myokr-period"
				:all="false"
				@updatePeriodInfo="queryOKRByUserId"
				icon="qzz_icon_guize1">
				<template #rightIcon>
					<i class="iconfont icon-riqi2"></i>
				</template>
			</PeriodList>
			<a-checkbox
				class="head-checkbox"
				v-model:checked="relatedMeCheckbox"
				@change="handelRelatedChange"
				>与我相关</a-checkbox
			>
		</header>
		<main>
			<a-spin :spinning="loading">
				<template v-if="okrData.length > 0">
					<a-checkbox-group
						v-model:value="checkList"
						@change="handelCheckboxChange">
						<template v-for="(item, index) in allOkrData" :key="item.id">
							<div class="checkbox-group">
								<!-- <a-checkbox :value="item.id" :disabled="item?.disabled"> -->
								<ul class="o-wrapper">
									<li class="O">O{{ item.importance }}</li>
									<li>{{ item.content }}</li>
									<li class="o-create">创建人：霞客</li>
								</ul>
								<!-- </a-checkbox> -->
								<div class="kr-checkbox">
									<a-checkbox
										v-for="(list, idx) in item.keyResults"
										:disabled="list?.disabled"
										:key="list.id"
										class="cur-checkbox"
										:value="list.id">
										<span class="KR">KR{{ idx + 1 }}</span>
										<span>
											{{ list.content }}
											<template
												v-for="userInfo in list.assistUsers"
												:key="userInfo.name">
												<span class="assit-user">@{{ userInfo.name }}</span>
											</template>
										</span>
										<span class="assit-user">@受益人</span>
									</a-checkbox>
								</div>
							</div>
							<a-divider v-if="index !== allOkrData.length - 1" />
						</template>
					</a-checkbox-group>
				</template>

				<a-empty
					v-else
					description="暂无数据"
					:image-style="{
						height: '230px',
					}">
				</a-empty>
			</a-spin>
		</main>
	</div>
</template>

<script setup lang='ts'>
import PeriodList from '@/components/periodList/src/index.vue';
import {GET_OKRLIST_BY_USERID, GET_CORRELATION_INFO} from '@/api/api';
import {computed, onMounted, ref, toRaw} from 'vue';
import {ProfileOutlined} from '@ant-design/icons-vue';
import {CheckboxChangeEvent} from 'ant-design-vue/es/checkbox/interface';

const okrData = ref([]); //okr数据
const checkList = ref([]); //选中的数据
const loading = ref(true);
const relatedMeCheckbox = ref(false); // 与我相关checkbox
const relatedMeData = ref([]);
const props = defineProps({
	info: {
		type: Object,
		default: {
			id: 0,
			relevanceType: '',
			relevanceCategory: '',
		},
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
	if (props.info.id) {
		const relationParams = {
			bizId: props.info.id,
			relevanceType: props.info.relevanceType,
			relevanceCategory: props.info.relevanceCategory,
		};
		const result = await GET_CORRELATION_INFO(relationParams);
		if (result.code == 1 && result.data.length > 0) {
			const okrRelationLen = result.data.filter(
				(item) => item.category == 'OKR'
			);
			if (okrRelationLen.length < 1) return;
			const relationIdArr = okrRelationLen[0].infoList.map((list) =>
				Number(list.id)
			);
			checkList.value = relationIdArr;
			okrData.value.forEach((item) => {
				// if (relationIdArr.includes(item.id)) {
				// 	item.disabled = true;
				// }
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
		// if (!item.disabled && e.includes(item.id)) {
		// 	item.type = 'O';
		// 	arr.push(toRaw(item));
		// }
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
// 与我相关点击
const handelRelatedChange = (e: CheckboxChangeEvent) => {
	console.log('e', e.target.checked);
};
const allOkrData = computed(() => {
	return [...okrData.value, ...relatedMeData.value];
});
onMounted(() => {
	getOkrList();
});
</script>

<style scoped lang='less'>
@import './index.less';
</style>
