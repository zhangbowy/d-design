<template>
	<a-modal
		:visible="dialogVisible"
		:keyboard="false"
		width="432"
		okText="确定"
		cancelText="取消"
		wrapClassName="dialog-box"
		:closable="false"
		:destroyOnClose="true"
		:maskClosable="false"
		:centered="true"
		:cancelButtonProps="{
			class: 'cancel-btn',
		}"
		@ok="handleSureEvent"
		@cancel="handleCancelEvent">
		<template #title>
			<iconpark-icon name="duihuakuangtubiao"></iconpark-icon>
			<span>{{ title }}</span>
		</template>
		<span>{{ content }}</span>
	</a-modal>
</template>

<script setup>
const props = defineProps({
	title: String,
	content: String,
	dialogVisible: Boolean,
});

const emit = defineEmits(['okEvent', 'cancelEvent']);

/**
 * handle ok event
 */
const handleSureEvent = () => {
	emit('okEvent');
};

/**
 * handle cancel event
 */
const handleCancelEvent = () => {
	emit('cancelEvent');
};
</script>

<style lang="less" >
@import './dialog.less';
</style>
