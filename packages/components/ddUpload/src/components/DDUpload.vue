<template>
	<div @click="handleUploadDD">
		<slot></slot>
	</div>
</template>

<script setup>
import {ref} from 'vue';
import {QUERY_CORP_SPACE, QUERY_DD_PERMISSION} from '../api';
import {getQueryVariable} from '@/utils/utils';
import * as dd from 'dingtalk-jsapi';
defineOptions({
	name: 'DDUpload',
});
const G_corpId = getQueryVariable('corpId');

const emit = defineEmits(['ddStartUpload', 'ddEndUpload']);

const spaceId = ref(''); //save current user space id
const filesList = ref([]); //save dd upload files

/**
 * handle dd upload event
 */
const handleUploadDD = async () => {
	await queryDDSpaceId();
	await ddPermission('add');
};

/**
 * query corp space id
 * @param {*} spaceId
 */
const queryDDSpaceId = async () => {
	const {code, data} = await QUERY_CORP_SPACE({});
	if (code === 1) {
		spaceId.value = data;
	}
};

/**
 * get dd space permission
 * @param {String} spaceId
 */
const ddPermission = async (type, item = {}) => {
	const {code} = await QUERY_DD_PERMISSION({
		type: type,
		fileIds: ['0'],
		duration: 3600,
		spaceId: spaceId.value,
	});
	if (code === 1) {
		uploadDD();
	}
};

/**
 * upload dd file
 * @param {*} types
 */
const uploadDD = () => {
	emit('ddStartUpload');
	dd.biz.util.uploadAttachment({
		image: {
			multiple: true,
			compress: true,
			max: 9,
			spaceId: spaceId.value,
		},
		space: {corpId: G_corpId, spaceId: spaceId.value, isCopy: 0, max: 9},
		file: {spaceId: spaceId.value, max: 1},
		types: ['space'], //PC["photo","file","space"]
		onSuccess: function (res) {
			filesList.value.push(...res.data);
			emit('ddEndUpload', filesList.value);
		},
		onFail: function (err) {
			console.log(err);
		},
	});
	if (filesList.value.length == 0) {
		emit('ddEndUpload', []);
	}
};
</script>

<style lang="less">
</style>
