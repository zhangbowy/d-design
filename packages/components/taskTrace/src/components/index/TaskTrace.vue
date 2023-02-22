<template>
	<a-modal
		:visible="visible"
		:closable="false"
		width="920"
		wrapClassName="map-box"
		:keyboard="false"
		:destroyOnClose="true"
		:maskClosable="false"
		:centered="true"
		:footer="null"
		@cancel="handleMapCancel">
		<a-spin :spinning="spinning">
			<div class="custom-header">
				<span class="title">任务追踪</span>
				<a-tooltip>
					<template #title>展开评论</template>
					<span class="expand-icon" @click="showComment = true"
						><iconpark-icon name="pinglunxiao"></iconpark-icon
						><span class="num">（{{ commentList.length }}）</span></span
					>
				</a-tooltip>
				<iconpark-icon
					class="close-x"
					name="guanbi"
					@click="handleMapCancel"></iconpark-icon>
			</div>
			<div class="map-key" @click="handleKeyEvent">
				<iconpark-icon name="guanjianshijian"></iconpark-icon>
				<span class="key-task">关键事件</span>
			</div>
			<main class="map-main" :class="{'map-main-left': showComment}">
				<div class="map-box">
					<!-- creator box -->
					<div
						class="creator-box"
						:class="{
							'border-none': principalUser == null && executeUser.length == 0,
						}">
						<div class="creator-title">
							<div
								class="line"
								:class="{
									'border-white':
										principalUser == null && executeUser.length == 0,
								}"></div>
							<div class="cycle-icon"></div>
							<span class="top-title">创建人</span>
						</div>
						<div class="creator-task">
							<div class="task-top">
								<AvatarVue :userData="createUser?.user" />
								<span
									class="task-tag"
									:class="{
										rp: createUser?.status === 'NOT_BEGIN',
										rd: createUser?.status === 'DONE',
										rt: createUser?.status === 'TERMINATION',
									}"
									>{{ returnTaskMark(createUser?.status) }}</span
								>
							</div>
							<div class="task-content">
								<span>{{ createUser?.content }}</span>
								<span
									class="task-files"
									v-if="returnFileNum(createUser?.taskAccessory) > 0"
									@click="handleFiles(createUser?.taskAccessory)">
									<iconpark-icon name="fujian"></iconpark-icon>
									<span
										>附件{{ returnFileNum(createUser?.taskAccessory) }}个</span
									>
								</span>
							</div>
							<div class="task-deadline" v-if="createUser?.abortTime">
								截止时间：{{ sliceSS(createUser?.abortTime) }}
							</div>
							<div
								class="task-description"
								v-if="createUser?.updateDescription">
								<span class="description-text"
									>更新说明：{{ createUser?.updateDescription }}
									<span
										class="task-files"
										v-if="returnFileNum(createUser?.accessory) > 0"
										@click="handleFiles(createUser?.accessory)">
										<iconpark-icon name="fujian"></iconpark-icon>
										<span
											>附件{{ returnFileNum(createUser?.accessory) }}个</span
										>
									</span>
								</span>
							</div>
						</div>
					</div>
					<!-- principal box -->
					<div
						v-if="principalUser != null"
						class="principal-box"
						:class="{'border-none': executeUser?.length === 0}">
						<div class="principal-title">
							<div class="line"></div>
							<div class="cycle-icon"></div>
							<span class="top-title">负责人</span>
						</div>
						<div class="principal-task">
							<div class="task-top">
								<AvatarVue :userData="principalUser?.user" />
								<span
									class="task-tag"
									:class="{
										unread:
											principalUser?.status === 'NOT_BEGIN' &&
											!principalUser?.read,
										rp:
											principalUser?.status === 'NOT_BEGIN' &&
											principalUser?.read,
										rd: principalUser?.status === 'DONE',
										rt: principalUser?.status === 'TERMINATION',
									}"
									>{{
										returnTaskMark(principalUser?.status, principalUser?.read)
									}}</span
								>
								<div
									v-if="
										taskData.role == 'CREATE' &&
										principalUser?.status === 'NOT_BEGIN' &&
										trait !== 'PROJECT'
									"
									class="task-remind-btn"
									@click="
										handleDDRemind(
											principalUser?.user,
											principalUser?.content,
											principalUser?.read
										)
									">
									<iconpark-icon
										v-if="principalUser?.read"
										name="Urge"></iconpark-icon>
									<iconpark-icon v-else name="remind"></iconpark-icon>
									<span>{{ principalUser?.read ? '催办' : '提醒' }}</span>
								</div>
							</div>
							<div class="task-deadline" v-if="principalUser?.abortTime">
								截止时间：{{ sliceSS(principalUser?.abortTime) }}
							</div>
							<div
								class="task-description"
								v-if="principalUser?.updateDescription">
								<span class="description-text"
									>更新说明：{{ principalUser?.updateDescription }}
									<span
										class="task-files"
										v-if="returnFileNum(principalUser?.accessory) > 0"
										@click="handleFiles(principalUser?.accessory)">
										<iconpark-icon name="fujian"></iconpark-icon>
										<span
											>附件{{ returnFileNum(principalUser?.accessory) }}个</span
										>
									</span>
								</span>
							</div>
						</div>
					</div>
					<!-- executor box -->
					<div class="executor-box" v-if="executeUser?.length > 0">
						<div class="executor-title">
							<div class="line"></div>
							<div class="cycle-icon"></div>
							<span class="top-title">参与人</span>
						</div>
						<div
							class="executor-task"
							:class="{'cur-point': item.executeUser.length > 1}"
							v-for="(item, index) in executeUser"
							:key="index"
							@click="
								item.executeUser.length > 1 && handleExcList(item.groupId)
							">
							<div class="task-top">
								<AvatarGroupVue :userData="item?.executeUser" />
								<span
									v-if="item?.executeUser.length == 1"
									class="task-tag"
									:class="{
										unread: item?.status === 'NOT_BEGIN' && !item?.read,
										rp: item?.status === 'NOT_BEGIN' && item?.read,
										rd: item?.status === 'DONE',
										rt: item?.status === 'TERMINATION',
									}"
									>{{ returnTaskMark(item?.status, item?.read) }}</span
								>
								<iconpark-icon
									v-else
									name="right"
									class="right-icon"></iconpark-icon>
								<div
									v-if="
										(taskData.role == 'CREATE' ||
											taskData.role == 'PRINCIPAL') &&
										item?.executeUser.length == 1 &&
										item?.status == 'NOT_BEGIN'
									"
									class="task-remind-btn"
									@click="
										handleDDRemind(item?.executeUser, item?.content, item?.read)
									">
									<iconpark-icon v-if="item?.read" name="Urge"></iconpark-icon>
									<iconpark-icon v-else name="remind"></iconpark-icon>
									<span>{{ item?.read ? '催办' : '提醒' }}</span>
								</div>
							</div>
							<div class="task-content">
								{{ item?.content }}
							</div>
							<div class="task-deadline" v-if="item?.leaderAbortTime">
								截止时间：{{ sliceSS(item?.leaderAbortTime) }}
							</div>
							<div class="task-description" v-if="item?.updateDescription">
								<span class="description-text"
									>更新说明：{{ item?.updateDescription }}
									<span
										class="task-files"
										v-if="returnFileNum(item?.accessory) > 0"
										@click="handleFiles(item?.accessory)">
										<iconpark-icon name="fujian"></iconpark-icon>
										<span>附件{{ returnFileNum(item?.accessory) }}个</span>
									</span>
								</span>
							</div>
						</div>
					</div>
				</div>
			</main>
			<!-- comments -->
			<div
				class="comment-wrapper"
				:class="{'comment-wrapper-absolute': showComment}">
				<div class="hd">
					<span class="title">评论列表({{ commentList.length }})</span>
					<a-tooltip>
						<template #title>收起评论</template>
						<iconpark-icon
							class="expand"
							name="shouqi-6hmh42kn"
							@click="showComment = false"></iconpark-icon>
					</a-tooltip>
					<iconpark-icon
						class="close-x"
						name="guanbi"
						@click="handleMapCancel"></iconpark-icon>
				</div>
				<div class="bd" ref="divRef">
					<div class="comment-item" v-for="item in commentList" :key="item">
						<div class="comment-item-hd">
							<img
								v-if="item.fromUser && item.fromUser.avatar"
								class="avatar"
								:src="returnImgUrl(item.fromUser.avatar, '_24x24.jpg')"
								alt="" />
							<span class="avatar-box" v-else>{{
								returnFirstT(item.fromUser.name)
							}}</span>
							<span class="name">{{ item.fromUser.name }}</span>
							<span class="role" v-if="item.role && item.role != 'FOR_CREATE'">
								<template v-if="item.role == 'CREATE'">创建人</template>
								<template v-if="item.role == 'PRINCIPAL'">负责人</template>
								<template v-if="item.role == 'EXECUTE'">参与人</template>
							</span>
							<span class="time">{{ formatTime(item.created) }}</span>
							<span
								class="reply-btn"
								v-if="item.fromUser.userId !== curUser.userId"
								@click="addReply(item)"
								>回复</span
							>
						</div>
						<!-- 回复的 -->
						<template v-if="item.toComment">
							<div class="comment-item-reply">
								<div class="reply-box">
									<!-- <span class="reply-name"
                    >回复{{ item.toComment.fromUser.name }}</span
                  > -->
									<span class="reply-cont" v-html="item.content"></span>
								</div>
								<div
									class="reference-cont"
									v-html="item.toComment.content"></div>
							</div>
						</template>
						<!-- 直接评论的 -->
						<template v-else>
							<div class="comment-item-cont" v-html="item.content"></div>
						</template>
						<div
							class="accessory-box"
							v-if="returnFilesCnt(item.accessory) > 0"
							@click="showFileModal(item.accessory)">
							<iconpark-icon class="icon" name="fujian"></iconpark-icon>
							<span class="file-list"
								>附件{{ returnFilesCnt(item.accessory) }}个</span
							>
						</div>
					</div>
				</div>
				<div class="comments-operation">
					<!-- <div class="ft">
            <div class="comment-input">
              <div class="comment-name" v-if="replyUserInfo.name">
                回复{{ replyUserInfo.name }}
              </div>
              <a-textarea
                ref="inputRef"
                :bordered="false"
                :maxlength="140"
                v-model:value="commentValue"
                placeholder="请输入评论"
                :autoSize="{ minRows: 1, maxRows: 3 }"
                @keydown.delete="onKeyDelClick"
              />
            </div>
          </div> -->
					<Edit
						:placeholder="'输入@提及同事'"
						:taskId="getTaskMainId(taskData)"
						:commentValue="commentValue"
						@updateValue="updateValue"
						@updateMarkUsers="updateMarkUsers"
						@updateContent="updateContent" />
					<div class="file-wrapper">
						<div class="file-box" ref="upFileRef">
							<div
								class="file-item"
								v-for="item in accessory.ossAccessoryList"
								:key="item.ossMaterialId">
								<a-image
									v-if="returnType(item.cname)"
									class="file-img"
									:src="item.originalUrl">
									<template #previewMask>
										<iconpark-icon name="preview"></iconpark-icon>
									</template>
								</a-image>
								<img
									v-else
									class="file-img-not_img"
									src="https://daily-static-file.oss-cn-shanghai.aliyuncs.com/file-icon.svg"
									alt="" />
								<span class="file-name">{{ formatName(item.fileName) }}</span>
								<iconpark-icon
									name="delete"
									class="delete-icon"
									@click.stop="
										deleteFile(
											accessory.ossAccessoryList,
											item.ossMaterialId,
											'oss'
										)
									"></iconpark-icon>
							</div>
						</div>
						<div class="file-icon">
							<OssUploadVue
								:taskId="taskData.id"
								@startUpload="startUpload"
								@endUpload="endUpload">
								<iconpark-icon class="icon" name="fujian"></iconpark-icon>
							</OssUploadVue>
						</div>
					</div>
					<div class="btns" v-if="commentValue">
						<a-button size="small" @click="handleMapCancel">取消</a-button>
						<a-button
							size="small"
							type="primary"
							:disabled="isShow"
							@click="submitComment"
							>提交</a-button
						>
					</div>
				</div>
				<!-- <Comment /> -->
			</div>
		</a-spin>
	</a-modal>
	<!-- executer list component -->
	<ExcListVue
		:visible="excList.visible"
		:groupId="excList.groupId"
		:taskData="taskData"
		@closeExcList="closeExcList" />
	<!-- key event component -->
	<KeyEventVue
		:visible="event.visible"
		:taskId="event.taskId"
		:curUser="curUser"
		@closeEvent="closeEvent" />
	<!-- files list component -->
	<FileListVue
		:appendixShow="appendix.appendixShow"
		:accessory="appendix.accessory"
		@hideFiles="hideFiles" />

	<!-- comment file list -->
	<FileListVue
		:appendixShow="commentFileObj.appendixShow"
		:accessory="commentFileObj.accessory"
		@hideFiles="hideCommentFiles" />
</template>

<script setup>
import {reactive, ref, toRefs, watch, nextTick} from 'vue';
import {QUERY_TASK_MAP, ADD_COMMENT, GET_COMMENT} from '../../api';
import {sliceSS, getTaskMainId} from '../../utils/utils';
import {handleRemindDD} from '../../utils/ddRemind';
import {message} from 'ant-design-vue';
import AvatarVue from '@/components/createTask/src/components/avatar/avatar.vue';
import AvatarGroupVue from '@/components/createTask/src/components/avatar/AvatarGroup.vue';
import ExcListVue from '../excList/ExcList.vue';
import KeyEventVue from '../keyEvent/KeyEvent.vue';
import FileListVue from '../fileList/FileList.vue';
import OssUploadVue from '@/components/upload/index';
import Edit from '@/components/edit/src/index';

defineOptions({
	name: 'TaskTrace',
});
const props = defineProps({
	visible: Boolean,
	taskData: {
		type: [Object, null],
		required: true,
	},
	curUser: {
		type: Object,
		required: true,
	},
	trait: {
		type: String,
		default: 'QZP',
		required: true,
	},
});
const showComment = ref(true);
const commentValue = ref('');
const commentList = ref([]);
const markUsers = ref([]);
const inputRef = ref(null);
const divRef = ref(null);
const upFileRef = ref(null);
const isShow = ref(true);
const content = ref(''); //save comment text
const replyUserInfo = reactive({
	name: '',
	userId: '',
	toId: '',
});
const accessory = reactive({
	ossAccessoryList: [],
});
const commentFileObj = reactive({
	appendixShow: false,
	accessory: {},
});
const emit = defineEmits(['closeMap']);
const mapUser = reactive({
	createUser: {},
	principalUser: {},
	executeUser: [],
}); //save map data
const excList = reactive({
	visible: false,
	groupId: null,
}); //save exc list component data
const event = reactive({
	visible: false,
	taskId: 0,
});
const appendix = reactive({
	appendixShow: false,
	accessory: {},
});
const spinning = ref(false); //save spin status
watch(
	() => props.visible,
	(val, oldVal) => {
		if (val) {
			queryMap();
			getCommentList();
			accessory.ossAccessoryList = [];
		}
	}
);
/**
 * handle map close event
 */
const handleMapCancel = () => {
	emit('closeMap');
};

/**
 * query map data
 */
const queryMap = async () => {
  let id = getTaskMainId(props.taskData);
  spinning.value = true;
  const { data, code } = await QUERY_TASK_MAP({
    id,
  });
  if (code === 1) {
    const { createUser, principalUser, executeUser } = data;
    mapUser.createUser = createUser;
    mapUser.principalUser = principalUser;
    mapUser.executeUser = executeUser;
    spinning.value = false;
  }
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
 * handle check executer list event
 * @param {Number} id
 */
const handleExcList = (id) => {
	excList.visible = true;
	excList.groupId = id;
};
/**
 * handle close excList component callback event
 */
const closeExcList = () => {
	excList.visible = false;
};
/**
 * handle open key event component event
 */
const handleKeyEvent = () => {
	event.visible = true;
	event.taskId = props.taskData.id;
};
/**
 * handle key event component close callback event
 */
const closeEvent = () => {
	event.visible = false;
};
/**
 * handle open files component
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
/*
 * add reply
 * */
const addReply = (item) => {
	//赋值
	replyUserInfo.name = item.fromUser.name;
	replyUserInfo.userId = item.fromUser.userId;
	replyUserInfo.toId = item.id;
	commentValue.value = `<span class="reply-box" style="color:#3073ff" contenteditable="false">回复${item.fromUser.name}</span>&nbsp;`;
};
/*
 * get comment list
 * */
const getCommentList = (callback) => {
	let bizId = '';
	if (props.taskData.type == 'SUB_TASK') {
		bizId = props.taskData.bizId;
	} else if (props.taskData.type == 'MAIN_TASK') {
		bizId = props.taskData.id;
	}
	GET_COMMENT({
		bizId: bizId,
		bizType: '2',
	}).then((res) => {
		if (res.code == 1) {
			commentList.value = res.data.resultList;
			if (commentList.value.length > 0) {
				showComment.value = true;
			}
			if (callback) {
				callback();
			}
			nextTick(() => {
				if (props.taskData.commentNum > 0) {
					divRef.value.scrollTop = divRef.value.scrollHeight;
				}
			});
		}
	});
};
/*
 * submit comment
 * */
const submitComment = () => {
	if (commentValue.value.replace(/(^\s*)|(\s*$)/g, '') == '') {
		return;
	}
	let ass = {};
	ass.ossAccessoryList = [];
	accessory.ossAccessoryList.forEach((i) => {
		let item = {};
		item.ossId = i.ossMaterialId;
		item.type = i.type;
		ass.ossAccessoryList.push(item);
	});
	let bizId = '';
	if (props.taskData.type == 'SUB_TASK') {
		bizId = props.taskData.bizId;
	} else if (props.taskData.type == 'MAIN_TASK') {
		bizId = props.taskData.id;
	}
	//judge did reply
	if (!commentValue.value.includes('reply-box')) {
		replyUserInfo.toId = '';
	}
	ADD_COMMENT({
		bizId: bizId,
		bizType: '2',
		content: commentValue.value.replace(/(^\s*)|(\s*$)/g, ''),
		toId: replyUserInfo.toId, //被回复人的评论id
		accessory: ass,
		markUsers: markUsers.value,
	}).then((res) => {
		if (res.code == 1) {
			if (replyUserInfo.toId) {
				message.success('回复成功');
			} else {
				message.success('评论成功');
			}
			//清空userinfo
			commentValue.value = '';
			replyUserInfo.name = '';
			replyUserInfo.userId = '';
			replyUserInfo.toId = '';
			accessory.ossAccessoryList = [];
			//更新数据
			const callback = () => {
				//滚动到底部
				nextTick(() => {
					divRef.value.scrollTop = divRef.value.scrollHeight;
				});
			};
			getCommentList(callback);
		}
	});
};
/*
 * del textarea content
 * */
const onKeyDelClick = (e) => {
	if (e.target.value == '                    ') {
		replyUserInfo.name = '';
		replyUserInfo.userId = '';
		replyUserInfo.toId = '';
		commentValue.value = '';
	}
};
const returnImgUrl = (originalImgUrl, size) => {
	return originalImgUrl + size;
};
const returnFirstT = (str) => {
	return str.substring(0, 1);
};
const formatTime = (str) => {
	return str.substring(5, 16);
};
const formatName = (str) => {
	if (str.length > 4) {
		return str.substring(0, 4) + '..';
	} else {
		return str;
	}
};
/**
 * upload oss start callback
 */
const startUpload = () => {
	spinning.value = true;
};

/**
 * upload oss end callback
 * @param {Array} ossArr
 */
const endUpload = (ossArr) => {
	spinning.value = false;
	accessory.ossAccessoryList.push(...ossArr);
	nextTick(() => {
		upFileRef.value.scrollTop = upFileRef.value.scrollHeight;
	});
};
/**
 * judge oss upload file type did img
 * @param {String} cname
 */
const returnType = (cname) => {
	let type = cname.split('.')[1];
	if (type == 'png' || type == 'jpg' || type == 'jpeg') {
		return true;
	} else {
		return false;
	}
};
/**
 * delete current file
 * @param {Number} id
 */
const deleteFile = (arr, id, type) => {
	arr.forEach((el, index) => {
		if (el.fileId === id && type === 'dd') {
			arr.splice(index, 1);
		}
		if (el.id === id && type === 'oss') {
			arr.splice(index, 1);
		}
	});
};

/*
 * show file modal
 * */
const showFileModal = (files) => {
	commentFileObj.appendixShow = true;
	commentFileObj.accessory.ossAccessory = files.ossAccessory;
	commentFileObj.accessory.dingDishAccessory = files.dingDishAccessory;
};
/**
 * close commentFileModal event
 */
const hideCommentFiles = () => {
	commentFileObj.appendixShow = false;
};

/**
 * dd remind event
 * @param {Array|Object} user
 * @param {String} content
 */
const handleDDRemind = (user, content, read = true) => {
	let bizId = getTaskMainId(props.taskData);
	let keyEventUrgeCommand = {};
	keyEventUrgeCommand.rightUser = user;
	keyEventUrgeCommand.content = content;
	keyEventUrgeCommand.role = props.taskData.role;
	keyEventUrgeCommand.id = bizId;
	handleRemindDD(
		user,
		content,
		props.taskData.id,
		props.trait,
		true,
		keyEventUrgeCommand
	);
};

/**
 * update comment value event
 * @param {String} value
 */
const updateValue = (value) => {
	commentValue.value = value;
};

/**
 * update comment mark users
 * @param {Array} arr
 */
const updateMarkUsers = (arr) => {
	markUsers.value = arr;
};

/**
 * update content text
 * @param {String} val
 */
const updateContent = (val) => {
	content.value = val;
	if (
		content.value.replace(/(^\s*)|(\s*$)/g, '') == `回复${replyUserInfo.name}`
	) {
		isShow.value = true;
	} else {
		isShow.value = false;
	}
};

/**
 *
 * @param {Object} files oss and dd files gather
 */
const returnFilesCnt = (files) => {
	return files?.dingDishAccessory.length + files?.ossAccessory.length;
};

const {createUser, principalUser, executeUser} = toRefs(mapUser);
</script>

<style lang="less">
@import './taskMap.less';
</style>
