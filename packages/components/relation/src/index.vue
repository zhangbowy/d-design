<template>
	<a-modal
		:visible="visible"
		title="添加关联"
		@ok="handleOk"
		:width="980"
		cancelText="取消"
		okText="确定"
		class="relation-wrapper"
		@cancel="handelCancel"
		:confirmLoading="confirmLoading"
		centered>
		<header>
			<a-radio-group v-model:value="curTab">
				<a-radio-button
					class="radio-btn"
					v-for="item in tabs"
					:key="item"
					:value="item">
					{{ TABS_ENUM[item] }}
				</a-radio-button>
			</a-radio-group>
		</header>
		<a-config-provider :locale="zhCN">
			<main>
				<Okr
					@handelCheckedCallback="handelCheckedCallback"
					v-if="tabs.includes('OKR')"
					:relevanceType="info.relevanceType"
					:biz-id="info.id"
					v-show="curTab == 'OKR'" />
				<Project
					v-if="tabs.includes('PROJECT')"
					:okr-info="info"
					v-show="curTab == 'PROJECT'"
					@handelCheckedCallback="handelCheckedCallback" />
				<Task
					v-if="tabs.includes('TASK')"
					:okr-info="info"
					v-show="curTab == 'TASK'"
					@handelCheckedCallback="handelCheckedCallback" />
			</main>
		</a-config-provider>
	</a-modal>
</template>

<script setup lang='ts'>
import {onMounted, reactive, ref} from 'vue';
import {TABS_ENUM} from './enum';
import {ADD_RELATION,ADD_OKR_RELATION} from '@/api/api'
import Project from './components/Project/index.vue'
import Task from './components/Task/index.vue'
import Okr from './components/Okr/index.vue'
import { relevanceType,reverseTabEnum } from './enum';
import {message} from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
defineOptions({
	name: 'Relation',
});
const emit = defineEmits(["update:visible", "refreshList","successCallback"]);
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
        default: {},
    }
});
const curTab = ref(props.tabs[0]);
const confirmLoading = ref(false)
const newCheckArr = ref([])
const allRelation = ref({})
// check的回调
const handelCheckedCallback = (val) => {
    allRelation.value[val.type] = val.checkedArr
    console.log('allRelation.value',allRelation.value)
//   newCheckArr.value = val;
};
// 成功回调
const handleOk = async () => {
    confirmLoading.value = true
    const formatArr = Object.keys(allRelation.value).filter(item=>allRelation.value[item].length>0).map(item=>{
        const objArr = allRelation.value[item].map(list=>({
            id:list.id||list.projectId,
            relevanceType: relevanceType[list.type]||'PROJECT',
            relevanceCategory: item,
        }))
        return objArr
    })
    const params = {
    sourceInfo: {
      id: props.info.id,
      relevanceType: props.info.relevanceType,
      relevanceCategory: props.info.relevanceCategory,
    },
    targetInfo: formatArr.flat(Infinity),
    relevanceSource: "ADD",
  };
  if(!props.tabs.includes('TASK')){
    emit('successCallback',params)
    confirmLoading.value = false
    emit("update:visible", false);
    return false
  }
  const res =  await ADD_RELATION(params);
  if (res.code == 1) {
    message.success('关联成功!');
    emit("refreshList");
  }
  confirmLoading.value = false
  emit("update:visible", false);
};
// 关闭弹窗
const handelCancel =() =>{
    emit("update:visible", false);
}
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
