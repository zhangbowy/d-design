<template>
	<a-modal
		:visible="visible"
		title="添加关联"
		@ok="handleOk"
		:width="780"
		cancelText="取消"
		okText="确定"
		class="relation-wrapper"
		centered>
		<header>
			<a-radio-group v-model:value="curTab">
				<a-radio-button v-for="item in tabs" :key="item" :value="item">{{
					TABS_ENUM[item]
				}}</a-radio-button>
			</a-radio-group>
		</header>
		<main></main>
	</a-modal>
</template>

<script setup lang='ts'>
import {ref} from 'vue';
import {TABS_ENUM} from './enum';

defineOptions({
	name: 'Relation',
});
const props = defineProps({
	visible: {
		type: Boolean,
		default: true,
	},
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
});
const curTab = ref(props.tabs[0]);
// 成功回调
const handleOk = () => {};
</script>

<style scoped lang='less'>
@import './index.less';
</style>
