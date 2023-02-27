<template>
	<a-modal
		:visible="visible"
		title="参与人"
		width="920"
		wrapClassName="exc-list-box"
		:keyboard="false"
		:destroyOnClose="true"
		:maskClosable="false"
		:centered="true"
		:footer="null"
		@cancel="handleExcCancel">
		<a-spin :spinning="spinning">
			<a-tabs v-model:activeKey="activeKey" @change="handleChangeTab">
				<a-tab-pane
					v-for="item in tabs"
					:key="item.name"
					:tab="`${item.title}(${item.num})`">
					<ul class="participant-ul">
						<template v-if="curExecArr.length > 0">
							<li class="participant-li" v-for="(el, i) in curExecArr" :key="i">
								<div class="participant-data">
									<div class="left-data">
										<avatarVue class="user-avatar" :userData="el?.userDTO" />
									</div>
									<span
										class="user-tag"
										:class="{
											unread: el.status === 'NOT_BEGIN' && !el.read,
											rp: el.status === 'NOT_BEGIN' && el.read,
											rd: el.status === 'DONE',
											rt: el.status === 'TERMINATION',
										}">
										{{ returnTaskMark(el.status, el.read) }}
									</span>
								</div>
								<div v-if="el.status == 'DONE'" class="renew-text">
									更新说明：{{ el.updateDescription }}
									<span
										class="appendix-span"
										v-if="returnFileNum(el?.accessory) > 0"
										@click="handleFiles(el?.accessory)">
										<iconpark-icon
											name="fujian"
											class="appendix-icon"></iconpark-icon>
										附件{{ returnFileNum(el?.accessory) }}个
									</span>
								</div>
							</li>
						</template>
						<a-empty
							v-else
							image="//qzz-static.forwe.store/public-assets/task-empty.png"
							:description="`暂无${item.title}参与人`"
							:imageStyle="{
								height: '200px',
							}"></a-empty>
					</ul>
					<div
						v-if="
							Array.isArray(execList['NOT_DONE']) &&
							execList['NOT_DONE'].length > 0 &&
							item.name == 'NOT_DONE' &&
							taskData.role != 'EXECUTE'
						"
						class="exc-remind-box">
						<div
							v-if="!isAllRead && trait != 'PROJECT'"
							class="remind-btn"
							@click="handleUnread">
							<iconpark-icon name="remind"></iconpark-icon>
							<span>提醒未读人员</span>
						</div>
						<div
							v-if="trait != 'PROJECT'"
							class="press-btn"
							@click="handlePress">
							<iconpark-icon name="Urge"></iconpark-icon>
							<span>催办全部人员</span>
						</div>
					</div>
				</a-tab-pane>
			</a-tabs>
		</a-spin>
	</a-modal>
	<!-- files list component -->
	<FileListVue
		:appendixShow="appendix.appendixShow"
		:accessory="appendix.accessory"
		@hideFiles="hideFiles" />
</template>

<script setup>
import {ref, watch, reactive} from 'vue';
import {QUERY_MAP_EXEC} from '../../api';
import {getTaskMainId} from '../../utils/utils';
import {handleRemindDD} from '../../utils/ddRemind';
import avatarVue from '@/components/createTask/src/components/avatar/avatar.vue';
import FileListVue from '../fileList/FileList.vue';

const props = defineProps({
	visible: Boolean,
	groupId: String,
	taskData: Object,
	trait: String,
});

const emit = defineEmits(['closeExcList']);

const activeKey = ref('NOT_DONE'); //tabs select key
const spinning = ref(false); //control spin status
const execList = ref([]); //save executer list
const curExecArr = ref([]); //save current type exec
const isAllRead = ref(false); //judge executor is all process
const tabs = ref([
	{
		title: '未完成',
		name: 'NOT_DONE',
		num: 0,
	},
	{
		title: '已完成',
		name: 'DONE',
		num: 0,
	},
]);
const appendix = reactive({
	appendixShow: false,
	accessory: {},
});
watch(
	() => props.visible,
	(val, oldVal) => {
		if (val) {
			queryExcList();
		}
	}
);

/**
 * handle close component event
 */
const handleExcCancel = () => {
	emit('closeExcList');
};

/**
 * handle query executer list
 */
const queryExcList = async () => {
	let groupId = props.groupId;
	spinning.value = true;
	const {code, data} = await QUERY_MAP_EXEC({
		groupId,
	});
	if (code === 1) {
		tabs.value.forEach((el) => {
			if (data.hasOwnProperty(el.name)) {
				el.num = data[el.name].length;
			}
		});
		activeKey.value = tabs.value[0].num == 0 ? 'DONE' : 'NOT_DONE';
		execList.value = data;
		curExecArr.value = execList.value[activeKey.value];
		judgeUnread();
		spinning.value = false;
	}
};

/**
 * handle tab change event
 * @param {String} type
 */
const handleChangeTab = (type) => {
	curExecArr.value = execList.value[type];
};

/**
 * return task mark
 * @param {String} type
 * @return {String}
 */
const returnTaskMark = (type, read = true) => {
	switch (type) {
		case 'NOT_BEGIN':
			if (!read) return '未读';
			return '未完成';
		case 'DONE':
			return '已完成';
		case 'TERMINATION':
			return '已终止';
		default:
			return;
	}
};

/**
 * return files num
 * @param {Object} files
 */
const returnFileNum = (files) => {
	let count = 0;
	if (files?.dingDishAccessory?.length > 0) {
		count += files.dingDishAccessory.length;
	}
	if (files?.ossAccessory?.length > 0) {
		count += files.ossAccessory.length;
	}
	return count;
};

/**
 * handle files list component
 * @param {Array} fileList
 */
const handleFiles = (fileList) => {
	appendix.accessory = fileList;
	appendix.appendixShow = true;
};

/**
 * close appendix event
 */
const hideFiles = () => {
	appendix.appendixShow = false;
};

/**
 * judge unread user
 */
const judgeUnread = () => {
	let users = [];
	execList.value['NOT_DONE'].map((el) => {
		if (!el.read) users.push(el.userDTO);
	});
	if (users.length === 0) {
		isAllRead.value = true;
	} else {
		isAllRead.value = false;
	}
};

/**
 * dd remind un read user
 */
const handleUnread = () => {
	let users = [];
	let content = '';
	execList.value['NOT_DONE'].map((el, index) => {
		if (index == 0) content = el.content;
		if (!el.read) users.push(el.userDTO);
	});
	handleRemindDD(users, content, props.taskData.id, props.trait);
};

/**
 * dd press process executor
 */
const handlePress = () => {
	let users = [];
	let content = '';
	let bizId = getTaskMainId(props.taskData);
	execList.value['NOT_DONE'].map((el, index) => {
		if (index == 0) content = el.content;
		users.push(el.userDTO);
	});
	let keyEventUrgeCommand = {};
	keyEventUrgeCommand.rightUser = users;
	keyEventUrgeCommand.content = content;
	keyEventUrgeCommand.role = props.taskData.role;
	keyEventUrgeCommand.id = bizId;
	handleRemindDD(
		users,
		content,
		props.taskData.id,
		props.trait,
		true,
		keyEventUrgeCommand
	);
};
</script>

<style lang="less">
@import './excList.less';
</style>
