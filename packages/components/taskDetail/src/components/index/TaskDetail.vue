<template>
	<a-drawer :visible="visible" class="task-detail-drawer" placement="right" :width="480" :keyboard="false"
		:zIndex="zIndex" :maskClosable="false" :destroyOnClose="true" :mask="mask" @close="handleDrawerClose">
		<template #title>
			<div class="task-detail-title">
				<span>{{ title }}</span>
				<a-popover :getPopupContainer="(triggerNode) => triggerNode.parentNode" trigger="click">
					<template #content>
						<span class="termination-task" @click="handleReloadTask(true)">终止任务</span>
					</template>
					<iconpark-icon v-if="taskDetail.status === 'NOT_BEGIN'" name="gengduo"
						class="operation-icon"></iconpark-icon>
				</a-popover>
			</div>
		</template>
		<!-- input box -->
		<div class="content-box">
			<a-textarea v-model:value="content" class="detail-textarea" placeholder="请填写任务内容"
				:auto-size="{ minRows: 1 }" :maxlength="150" :autoFocus="true"
				:disabled="role == 'EXECUTE' || status != 'NOT_BEGIN'" />
			<a-spin v-if="taskDetail.type === 'MAIN_TASK'" :spinning="spinning">
				<div class="upload-box">
					<div class="file-box">
						<div class="file-list" v-for="item in accessory.ossAccessory" :key="item.ossMaterialId"
							@click="handleDownloadFile(item)">
							<a-image v-if="returnType(item.cname)" class="file-img" :src="item.originalUrl" @click.stop>
								<template #previewMask>
									<iconpark-icon name="preview"></iconpark-icon>
								</template>
							</a-image>
							<img v-else class="file-img-not_img"
								src="https://daily-static-file.oss-cn-shanghai.aliyuncs.com/file-icon.svg" alt="" />
							<span class="file-name">{{ item.fileName }}</span>
							<iconpark-icon v-if="status == 'NOT_BEGIN'" name="delete" class="delete-file-icon"
								@click.stop="
									deleteFile(accessory.ossAccessory, item.ossMaterialId, 'oss')
								"></iconpark-icon>
						</div>
					</div>
					<OssUploadVue v-if="status == 'NOT_BEGIN'" class="upload-icon" :taskId="returnSnow()"
						@startUpload="startUpload" @endUpload="endUpload">
						<iconpark-icon class="icon" name="fujian"></iconpark-icon>
					</OssUploadVue>
				</div>
			</a-spin>
		</div>
		<!-- main task text -->
		<div class="main-task-text" v-if="taskDetail.mainTaskContent">
			<span class="main-task-content" @click="handleTaskTrace">{{ taskDetail.mainTaskContent }}</span>
			<div v-if="accessory.ossAccessory.length > 0" class="file-btn" @click="handleCheckFiles">
				<iconpark-icon name="uploadIcon"></iconpark-icon>
				<span>附件{{ accessory.ossAccessory.length }}个</span>
			</div>
		</div>
		<!-- task info box -->
		<div class="task-info">
			<span class="info-time">创建时间：{{ sliceSS(created) }}</span>
			<span class="info-tag" :class="{
				rp: status === 'NOT_BEGIN',
				rd: status === 'DONE',
				rt: status === 'TERMINATION',
			}">{{ returnTaskMark(status) }}</span>
		</div>
		<!-- add creator box -->
		<div class="add-creator">
			<span class="public-title">创建人</span>
			<div class="create-box">
				<div v-if="checkNullObj(createUser)" class="empty-text">
					选择创建人
				</div>
				<div v-else class="user-box">
					<AvatarVue :userData="createUser" />
				</div>
			</div>
		</div>
		<!-- add principal box -->
		<div class="add-principal">
			<span class="public-title">负责人</span>
			<div class="public-box" :class="{
				// 'dis-bgc': role == 'EXECUTE' || status != 'NOT_BEGIN',
				'prin-null': role == 'EXECUTE' || status != 'NOT_BEGIN',
			}" @click="
	role != 'EXECUTE' &&
	status == 'NOT_BEGIN' &&
	handleChooseUser('principal')
">
				<div v-if="checkNullObj(principalUser)" class="empty-text">
					{{
	role == "EXECUTE" || status != "NOT_BEGIN"
	? "无"
	: "选择负责人"
					}}
				</div>
				<div v-else class="user-box">
					<AvatarVue :userData="principalUser" />
				</div>
				<iconpark-icon name="right" class="right-icon"
					v-if="role != 'EXECUTE' && status == 'NOT_BEGIN'"></iconpark-icon>
			</div>
			<iconpark-icon name="delete" class="delete-icon" v-if="
				role != 'EXECUTE' &&
				status == 'NOT_BEGIN' &&
				!checkNullObj(principalUser)
			" @click="handleDeletePri()"></iconpark-icon>
		</div>
		<!-- add start time box -->
		<div class="add-deadline">
			<span class="public-title">任务开始时间</span>
			<div class="deadline-box"
				:class="{ 'dis-bgc': status != 'NOT_BEGIN', 'dis-text': (role == 'EXECUTE' && !checkCanUpdateTime(role)) }">
				<template v-if="status != 'NOT_BEGIN'">
					{{ sliceSS(taskDetail?.startTime) }}
				</template>
				<template v-else>
					<a-date-picker v-model:value="startTime" format="YYYY-MM-DD HH:mm" placeholder="选择时间" :show-time="{
						hideDisabledOptions: true,
						defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
					}" :allowClear="false" :autofocus="false" :showNow="false" :locale="locale" :disabled="status != 'NOT_BEGIN'"
						:disabledDate="disabledStartDate" @ok="confirmStartTime">
						<template v-slot:suffixIcon v-if="status == 'NOT_BEGIN'">
							<iconpark-icon name="right" class="right-icon"></iconpark-icon>
						</template>
					</a-date-picker>
				</template>
			</div>
		</div>
		<!-- add deadline box -->
		<div class="add-deadline">
			<span class="public-title">任务截止时间</span>
			<div v-if="dayFormat || status == 'NOT_BEGIN'" class="deadline-box"
				:class="{ 'dis-bgc': role == 'EXECUTE' || status != 'NOT_BEGIN', 'dis-text': (role == 'EXECUTE' && !checkCanUpdateTime(role)) }">
				<template v-if="role == 'EXECUTE' && !checkCanUpdateTime(role)">
					{{ sliceSS(taskDetail?.abortTime) }}
				</template>
				<template v-else>
					<a-date-picker v-model:value="dayFormat" format="YYYY-MM-DD HH:mm" placeholder="选择时间"
						:show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:00') }" :allowClear="false"
						:autofocus="false" :showNow="false" :locale="locale" :disabledDate="disabledDeadDate"
						:disabled="status != 'NOT_BEGIN'" @ok="confirmDeadline">
						<template v-slot:suffixIcon v-if="role != 'EXECUTE' && status == 'NOT_BEGIN'">
							<iconpark-icon name="right" class="right-icon"></iconpark-icon>
						</template>
					</a-date-picker>
				</template>
			</div>
			<div v-else class="deadline-null">无</div>
			<template v-if="role == 'EXECUTE' && !checkCanUpdateTime(role)">

			</template>
			<template v-else="">
				<iconpark-icon name="delete" class="delete-icon" v-if="status == 'NOT_BEGIN' && dayFormat"
					@click="handleDelAbortTime"></iconpark-icon>
			</template>

		</div>
		<!-- add time remind -->
		<div class="add-remind" v-if="dayFormat != null && status == 'NOT_BEGIN'">
			<!-- deadline remind box -->
			<div class="remind-box">
				<iconpark-icon name="tixing" class="remind-icon"></iconpark-icon>
				<span class="remind-text">提醒时间</span>
				<div class="custom-list">
					<div class="add-remind-btn" v-if="status == 'NOT_BEGIN'" @click="handleSelect">
						<iconpark-icon name="add" class="add-icon"></iconpark-icon>
						<a-select v-model:value="selectArr" mode="multiple" dropdownClassName="selector"
							:open="selectOpen" :dropdownMatchSelectWidth="false" @change="handleSelectChange"
							@blur="handleSelectBlur">
							<a-select-option class="remind-option" v-for="item in remindOptions.slice(0, 4)"
								:key="item.type" :value="item.type">{{ item.customTime }}</a-select-option>
							<a-select-option class="custom-option">
								<div class="custom-time">
									<div class="custom-btn">+ 自定义</div>
									<a-date-picker format="YYYY-MM-DD HH:mm" dropdownClassName="picker" :show-time="{
										defaultValue: dayjs(
											'00:00:00',
											'HH:mm:00'
										),
									}" :allowClear="false" :autofocus="false" :showNow="false" :locale="locale" @openChange="handlePickerChange"
										@ok="confirmRemindDeadline">
									</a-date-picker>
								</div>
							</a-select-option>
						</a-select>
					</div>
					<template v-for="item in remindOptions" :key="item.customTime">
						<div class="custom-box" v-if="item.choose">
							<span>{{ item.customTime }}</span>
							<iconpark-icon name="guanbi" class="close-icon"
								v-if="role != 'EXECUTE' && status == 'NOT_BEGIN'"
								@click="handleDeleteRemind(item)"></iconpark-icon>
						</div>
					</template>
				</div>
			</div>
			<!-- add-schedule -->
			<div class="schedule-box" v-if="role != 'EXECUTE'">
				<iconpark-icon name="richeng" class="remind-icon"></iconpark-icon>
				<span>插入钉钉日程</span>
				<a-switch :checked="openSchedule" :disabled="status != 'NOT_BEGIN'"
					@change="status == 'NOT_BEGIN' && handleSchedule()" />
			</div>
			<!-- add cycle -->
			<div v-if="cycleValue && role != 'EXECUTE' && trait === 'default'" class="cycle-box">
				<iconpark-icon name="loop" class="remind-icon"></iconpark-icon>
				<span class="cycle-title">任务循环</span>
				<a-select v-model:value="cycleValue" :dropdownMatchSelectWidth="false" @change="cycleChange"
					@focus="() => (customCycleShow = false)">
					<a-select-option class="cycle-option" v-for="item in cycleList" :key="item.type"
						:value="item.type">{{ item.content }}</a-select-option>
					<template #dropdownRender="{ menuNode: menu }">
						<v-nodes :vnodes="menu" />
						<a-divider style="margin: 4px 0" />
						<div class="cycle-custom-btn" @click="handleCustomCycle">
							+ 自定义
						</div>
					</template>
				</a-select>
				<div class="cycle-custom-box" v-if="customCycleShow">
					<a-input v-model:value="customCycleValue" placeholder="请填写">
						<template #addonAfter> 天 </template>
					</a-input>
					<a-button type="primary" :disabled="!customCycleValue" @click="handleConfirmCycle">确 定</a-button>
				</div>
			</div>
		</div>
		<!-- add exc box -->
		<div class="add-exc" v-if="role != 'EXECUTE'">
			<span class="public-title">参与人</span>
			<span class="empty-exc" v-if="status != 'NOT_BEGIN' && subTasks.length === 0">无</span>
			<div class="exc-list">
				<div class="exc-box" v-for="item in subTasks" :key="item.id">
					<div class="exc-main" @click="handleCheckExc(item)">
						<AvatarVue :userData="item.executeUser" />
						<div class="main-right">
							<div class="user-name">
								<span class="name-list">{{
									returnName(item.executeUser)
								}}</span>
								<span v-if="item.executeUser.length > 2">等{{ item.executeUser.length }}人</span>
								<iconpark-icon name="right" class="arrow-icon"
									v-if="status == 'NOT_BEGIN'"></iconpark-icon>
							</div>
							<div class="task-data">
								<span v-if="item.leaderAbortTime" class="deadline-time">截止{{
									returnTIme(item.leaderAbortTime)
								}}</span>
								<span class="side-task-content">{{
									item.content
								}}</span>
							</div>
						</div>
					</div>
					<iconpark-icon name="delete" class="exc-delete" v-if="status == 'NOT_BEGIN'"
						@click="handleDeleteSub(item.index)"></iconpark-icon>
				</div>
				<div class="add-remind-btn" v-if="role != 'EXECUTE' && status == 'NOT_BEGIN'" @click="handleAddExc">
					<iconpark-icon name="add" class="add-icon"></iconpark-icon>
				</div>
			</div>
		</div>
		<!-- add correlation -->
		<div v-if="trait === 'OKR'" class="add-correlation">
			<span class="public-title">关联项</span>
			<div v-if="!renderCorText()" class="add-cor-btn" @click="handleAddRelation()">
				<iconpark-icon name="guanlian"></iconpark-icon>
				<span>添加关联</span>
			</div>
			<div class="cor-text" :class="{'marginL': renderCorText()}" v-if="renderCorText()" @click="handleCheckRelation()">
				<iconpark-icon name="guanlian"></iconpark-icon>
				<span>{{ renderCorText() }}</span>
			</div>
		</div>
		<!-- create task footer box -->
		<template #footer>
			<Transition>
				<div class="add-footer" v-if="!isEdit">
					<a-button v-if="showDetail" class="cancel-btn" @click="handleTaskTrace">任务追踪</a-button>
					<a-button type="primary" class="sure-btn" :class="{ 'restart-btn': status != 'NOT_BEGIN' }"
						@click="handleReloadTask(false)">{{
	status == "NOT_BEGIN" ? "完成任务" : "重启任务"
						}}</a-button>
				</div>
				<div class="save-footer" v-else>
					<a-button class="cancel-btn" @click="handleDrawerClose">取消</a-button>
					<a-button type="primary" class="sure-btn" :disabled="judgeStrNull(content)" :loading="loading"
						@click="handleCreateTask">保存修改</a-button>
				</div>
			</Transition>
		</template>
	</a-drawer>
	<!-- choose user component -->
	<ChooseUserVue :visible="choose.visible" :searchAllZone="choose.searchAllZone" :multiSelect="choose.multiSelect"
		:title="choose.title" :selectedUsers="choose.selectedUsers" @updateUserIds="updateUserIds"
		@close="handleChooseClose" />
	<!-- add executor component -->
	<AddExcVue :visible="addExcVisible" :subTask="curSubTask" :isDisable="execDisable" @closeAddExc="closeAddExc"
		@addExc="addExc" />
	<!-- dialog component -->
	<DialogVue :dialogVisible="dialog.visible" :title="dialog.title" :content="dialog.content"
		@cancelEvent="cancelEvent" @okEvent="okEvent" />
	<!-- renew task status component -->
	<RenewTask :renewVisible="renewVisible" :toStatus="toStatus" :dragEl="taskDetail" :zIndex="1200"
		@closeRenew="closeRenew" />
	<!-- task trace component -->
	<TaskTrace :visible="map.visible" :taskData="taskDetail" :curUser="curUser" :trait="trait" @closeMap="closeMap" />
	<!-- upload file list -->
	<FileListVue :appendixShow="files.show" :accessory="files.accessory" @hideFiles="hideCommentFiles" />
	<Relation v-model:visible="relation.visible" :tabs="['OKR', 'PROJECT']" :info="relation.info"
		@successCallback="relationConfirm" />
	<LookRelation v-model:visible="lookRelation.visible" :info="lookRelation.info" @lookDetailCallback="lookDetailCallback" />
</template>

<script setup>
import { ref, reactive, toRefs, watch } from 'vue';
import { UP_DATA_TASK, GET_RELEVANCE_CNT } from '../../api';
import {
	checkNullObj,
	formatDate,
	judgeStrNull,
	sliceSS,
} from '../../utils/utils';
// import { useStore } from "vuex";
import { message } from "ant-design-vue";
import mitt from "@/utils/eventBus";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
import AvatarVue from "@/components/createTask/src/components/avatar/avatar.vue";
import ChooseUserVue from "@/components/chooseuser/components/index.vue";
import AddExcVue from "@/components/createTask/src/components/addExc/AddExc.vue";
import DialogVue from "@/components/createTask/src/components/dialog/Dialog.vue";
import RenewTask from "@/components/renewTask/src/index";
import OssUploadVue from "@/components/upload/src/index";
import FileListVue from "@/components/taskTrace/src/components/fileList/FileList.vue";
import TaskTrace from '@/components/taskTrace/src/index';
import Relation from '@/components/relation/src/index.vue';
import LookRelation from '@/components/lookRelation/index';
import * as dd from 'dingtalk-jsapi';

dayjs.locale('zh-cn');

const props = defineProps({
	visible: Boolean,
	title: String,
	taskDetail: Object,
	isCut: {
		type: Boolean,
		defaultValue: false,
	},
	mask: {
		type: Boolean,
		defaultValue: true,
	},
	showDetail: {
		type: Boolean,
		default: true,
		required: false,
	},
	zIndex: {
		type: Number,
		default: 1000,
		required: false,
	},
	curUser: {
		type: Object,
		required: true,
	},
	trait: {
		type: String,
		required: true,
	},
});

const emit = defineEmits(['closeDrawer', 'saveCurTaskId', 'successChange', 'checkRelationDetail']);

const cycleList = ref([
	{
		content: '不重复',
		type: 'NOT_REPEAT',
		value: 0,
	},
	{
		content: '每日',
		type: 'DAILY_REPEAT',
		value: 1,
	},
	{
		content: '每日跳过非工作日',
		type: 'DAILY_SKIP',
		value: 1,
	},
	{
		content: '每周',
		type: 'WEEK_REPEAT',
		value: 7,
	},
	{
		content: '每月',
		type: 'MONTH_REPEAT',
		value: 30,
	},
]);
const taskFrom = reactive({
	content: '',
	createUser: {},
	principalUser: {},
	abortTime: '',
	leaderAbortTime: '',
	remindType: [],
	subTasks: [],
	openSchedule: false,
	forCreateUser: null,
	dayFormat: null,
	selectArr: [],
	role: '',
	status: '',
	created: '',
	id: null,
	cycleValue: ['NOT_REPEAT'],
	loopType: {
		value: 0,
		type: 'NOT_REPEAT',
	},
	accessory: {
		ossAccessory: [],
		dingDishAccessory: [],
	},
	startTime: '',
}); //save task form
const files = reactive({
	show: false,
	accessory: {},
});

const choose = reactive({
	visible: false,
	searchAllZone: true,
	multiSelect: false,
	type: '',
	title: '',
	selectedUsers: [],
}); //control chose user component

const dialog = reactive({
	visible: false,
	title: '',
	content: '',
	type: '',
}); //save dialog data

const map = reactive({
	visible: false,
	taskId: null,
});
const relation = reactive({
	visible: false,
	info: {
		id: null,
		relevanceType: 'TASK_MAIN',
		relevanceCategory: 'TASK'
	},
});
const lookRelation = reactive({
	visible: false,
	info: {
		avatar: '',
		name: '',
		type: 'TASK',
		indexId: 0,
		content: '',
		id: null,
		sourceType: 'TASK',
		status: ''
	}
})

const remindOptions = ref([
	{
		type: '10',
		customTime: '截止前10分钟',
		choose: false,
	},
	{
		type: '30',
		customTime: '截止前30分钟',
		choose: false,
	},
	{
		type: '60',
		customTime: '截止前1个小时',
		choose: false,
	},
	{
		type: '120',
		customTime: '截止前2个小时',
		choose: false,
	},
]);
const addExcVisible = ref(false); //control add executer component visible
const curSubTask = ref({}); //save current subtask
const loading = ref(false); //create task  loading
const selectOpen = ref(false); //select open
const tag = ref(false); //compatibility select and picker
const copyFrom = ref({}); //copy task from, contrast data
const isEdit = ref(false); //judge did edit
const renewVisible = ref(false); //control renew task component visible
const toStatus = ref(''); //change status
const execDisable = ref(false); //control executor disable
const customCycleShow = ref(false); //control custom cycle box visible
const customCycleValue = ref(''); //save custom cycle value
const spinning = ref(false); //upload files loading control
const relationCallback = ref({});
const relationArr = ref([]);

watch(
	() => props.visible,
	(val, oldVal) => {
		if (val) {
			getRelevanceCnt();
			props.taskDetail.subTasks.forEach((el) => {
				el.index = el.id;
			});
			emit('saveCurTaskId', props.taskDetail.id);
			// store.commit("UPDATE_TASK_ID", props.taskDetail.id);
			let arr = []; //save remind template type
			//loop taskFrom keys assignment
			Object.keys(taskFrom).map((el) => {
				switch (el) {
					case 'dayFormat':
						taskFrom[el] = props.taskDetail.abortTime
							? dayjs(props.taskDetail.abortTime)
							: null;
						break;
					case 'cycleValue':
						if (props.taskDetail.loopType?.type === 'CUSTOM_CYCLE') {
							taskFrom[el] = ['每' + props.taskDetail.loopType?.value + '天'];
						} else {
							taskFrom[el] = [props.taskDetail.loopType?.type];
						}
						break;
					case 'startTime':
						taskFrom[el] = dayjs(props.taskDetail[el]);
						break;
					default:
						taskFrom[el] = props.taskDetail[el];
						break;
				}
			});
			taskFrom.remindType = [];
			remindOptions.value.forEach((el) => {
				el.choose = false;
			});
			props.taskDetail.remindList.forEach((el, val) => {
				if (el.type != '00') {
					arr.push(el.type);
					let index = remindOptions.value.findIndex((i) => i.type == el.type);
					remindOptions.value[index].choose = true;
				} else {
					let item = {};
					item.customTime = el.customTime;
					item.type = '00';
					item.choose = true;
					remindOptions.value.push(item);
				}
			});
			taskFrom.selectArr = arr;
			copyFrom.value = JSON.stringify(taskFrom);
			relationCallback.value = {};
		}
	}
);

watch(
	() => taskFrom,
	(val, oldVal) => {
		if (copyFrom.value == JSON.stringify(val)) {
			isEdit.value = false;
		} else {
			isEdit.value = true;
		}
	},
	{
		deep: true,
	}
);

watch(
	() => props.isCut,
	(val, oldVal) => {
		if (val) {
			handleDrawerClose();
		}
	}
);

watch(
	() => customCycleShow.value,
	() => {
		if (customCycleShow) {
			document.addEventListener(
				'click',
				(event) => closeCustomBox(event),
				true
			);
		}
	}
);

/**
 * handle drawer close event
 */
const handleDrawerClose = () => {
	if (isEdit.value) {
		dialog.visible = true;
		dialog.title = '关闭';
		dialog.content = taskFrom.content
			? '确定保存修改内容吗？'
			: '任务内容不可为空，离开后任务内容将重置';
		dialog.type = 'close';
	} else {
		emit('closeDrawer');
		emit('saveCurTaskId', null);
		// store.commit("UPDATE_TASK_ID", null);
	}
};

/**
 * choose user component callback
 * @param {Array} arr
 */
const updateUserIds = (arr) => {
	if (choose.type === 'creator') {
		taskFrom.createUser = arr[0];
	} else {
		taskFrom.principalUser = arr[0];
	}
	choose.visible = false;
};

/**
 * handle choose user public event
 * @param {String} type
 */
const handleChooseUser = (type) => {
	choose.type = type;
	choose.visible = true;
	if (type === 'creator') {
		choose.title = '请选择创建人';
		choose.selectedUsers = checkNullObj(taskFrom.createUser)
			? []
			: [taskFrom.createUser];
	} else {
		choose.title = '请选择负责人';
		choose.selectedUsers = checkNullObj(taskFrom.principalUser)
			? []
			: [taskFrom.principalUser];
	}
};

/**
 * close choose user callback
 */
const handleChooseClose = () => {
	choose.visible = false;
};

/**
 * handle delete principal event
 */
const handleDeletePri = () => {
	taskFrom.principalUser = {};
};

/**
 * confirm deadline callback
 * @param {String} time
 */
const confirmDeadline = (time) => {
	taskFrom.abortTime = formatDate(new Date(time));
	taskFrom.dayFormat = dayjs(taskFrom.abortTime);
};

/**
 * handle delete abort time event
 */
const handleDelAbortTime = () => {
	taskFrom.abortTime = '';
	taskFrom.dayFormat = null;
	remindOptions.value.forEach((el) => {
		el.choose = false;
	});
};

/**
 * handle select option change event
 * @param {Array} val
 */
const handleSelectChange = (val) => {
	taskFrom.selectArr = val;
	remindOptions.value.forEach((el) => {
		if (el.type == '00') return;
		el.choose = taskFrom.selectArr.some((i) => el.type === i);
	});
};

/**
 * handle custom time select event
 * @param {Date} date
 */
const confirmRemindDeadline = (date) => {
	let customTime = formatDate(new Date(date));
	let item = {};
	item.customTime = customTime;
	item.type = '00';
	item.choose = true;
	remindOptions.value.push(item);
	selectOpen.value = false;
};

/**
 * handle add executor event
 */
const handleAddExc = () => {
	addExcVisible.value = true;
	curSubTask.value = {};
};

/**
 * close add executer component callback
 */
const closeAddExc = () => {
	addExcVisible.value = false;
};

/**
 * handle add executer callback event
 * @param {Object} from
 */
const addExc = (from) => {
	let num = taskFrom.subTasks.findIndex((el) => el.index == from.index);
	if (num == -1) {
		taskFrom.subTasks.push(from);
	} else {
		taskFrom.subTasks[num] = from;
	}
	addExcVisible.value = false;
};

/**
 * return current subtask name list
 * @param {Array} nameArr
 */
const returnName = (nameArr) => {
	let arr = [];
	let nameStr = '';
	nameArr.forEach((el) => {
		arr.push(el.name);
	});
	if (arr.length <= 2) {
		nameStr = arr.join('、');
	} else {
		nameStr = arr.splice(0, 2).join('、');
	}
	return nameStr;
};

/**
 * handle custom abort time
 * @param {String} time
 */
const returnTIme = (time) => {
	let timeStr = time.split(' ')[0];
	let index = timeStr.indexOf('-');
	return timeStr.slice(index);
};

/**
 * handle delete current subtask event
 * @param {Number} index
 */
const handleDeleteSub = (index) => {
	let num = taskFrom.subTasks.findIndex((el) => el.index === index);
	taskFrom.subTasks.splice(num, 1);
};

/**
 * handle create task event
 */
const handleCreateTask = async () => {
	loading.value = true;
	remindOptions.value.forEach((el) => {
		if (el.choose && el.type !== '00') {
			let item = {};
			item.type = el.type;
			taskFrom.remindType.push(item);
		} else if (el.choose && el.type === '00') {
			taskFrom.remindType.push(el);
		}
	});
	if (taskFrom.createUser.userId != props.curUser.userId) {
		taskFrom.forCreateUser = props.curUser;
	}
	let fileItem = {};
	fileItem.dingDishAccessoryList = [];
	fileItem.ossAccessoryList = [];
	taskFrom.accessory.ossAccessory.map((el) => {
		let item = {};
		item.ossId = el.ossMaterialId;
		fileItem.ossAccessoryList.push(item);
	});
	const { code } = await UP_DATA_TASK({
		content: taskFrom.content,
		createUser: taskFrom.createUser,
		principalUser: taskFrom.principalUser,
		abortTime: taskFrom.abortTime,
		remindType: taskFrom.remindType,
		subTasks: taskFrom.subTasks,
		openSchedule: taskFrom.openSchedule,
		id: taskFrom.id,
		loopType: taskFrom.loopType,
		accessory: fileItem,
		startTime: dayjs(taskFrom.startTime).format('YYYY-MM-DD HH:mm:00'),
	});
	if (code === 1) {
		emit("successChange");
		message.success('任务修改成功');
		loading.value = false;
		emit('saveCurTaskId', null);
	} else {
		message.error('任务修改失败');
		loading.value = false;
		taskFrom.remindType = [];
	}
};

/**
 * handle dialog cancel event
 */
const cancelEvent = () => {
	dialog.visible = false;
	switch (dialog.type) {
		case 'close':
			if (taskFrom.content) emit('closeDrawer');
			emit('saveCurTaskId', null);
			// store.commit("UPDATE_TASK_ID", null);
			break;
		default:
			break;
	}
};

/**
 * handle dialog ok event
 */
const okEvent = () => {
	dialog.visible = false;
	switch (dialog.type) {
		case 'close':
			if (taskFrom.content) {
				handleCreateTask();
			} else {
				emit('closeDrawer');
				emit('saveCurTaskId', null);
				// store.commit("UPDATE_TASK_ID", null);
			}
			break;
		case 'schedule':
			taskFrom.openSchedule = true;
			break;
		case 'loop':
			renewVisible.value = true;
			break;
		default:
			break;
	}
};

/**
 * handle choose select remind time
 */
const handleSelect = () => {
	selectOpen.value = true;
};

/**
 * handle select blur event
 */
const handleSelectBlur = () => {
	if (tag.value) return;
	selectOpen.value = false;
};

/**
 * handle time picker visible event
 * @param {Boolean} status
 */
const handlePickerChange = (status) => {
	tag.value = true;
	if (!status) tag.value = false;
};

/**
 * handle delete remind time event
 * @param {Object} item
 */
const handleDeleteRemind = (item) => {
	if (item.type != '00') {
		remindOptions.value.forEach((el) => {
			if (el.type == item.type) {
				el.choose = false;
			}
		});
		let index = taskFrom.selectArr.findIndex((el) => el == item.type);
		taskFrom.selectArr.splice(index, 1);
	} else {
		remindOptions.value.forEach((el) => {
			if (el.customTime == item.customTime) {
				el.choose = false;
			}
		});
	}
};

/**
 * return task mark
 * @param {String} type
 * @return {String}
 */
const returnTaskMark = (type) => {
	switch (type) {
		case 'NOT_BEGIN':
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
 * return remind list number
 * @return {Number}
 */
const returnListNum = () => {
	let num = 0;
	remindOptions.value.forEach((el) => {
		if (el.choose) {
			num++;
		}
	});
	return num;
};

/**
 * handle check executer event
 * @param {Object} item
 */
const handleCheckExc = (item) => {
	addExcVisible.value = true;
	curSubTask.value = item;
	if (taskFrom.status == 'NOT_BEGIN') {
		execDisable.value = false;
	} else {
		execDisable.value = true;
	}
};

/**
 * handle finish or reload task
 */
const handleReloadTask = (isTermination = false) => {
	if (taskFrom.loopType?.type !== 'NOT_REPEAT' && isTermination) {
		dialog.content = '终止后将不再生成循环任务，确定终止任务？';
		dialog.title = '终止任务';
		dialog.type = 'loop';
		dialog.visible = true;
	} else {
		renewVisible.value = true;
	}
	if (isTermination) {
		toStatus.value = 'TERMINATION';
		return;
	}
	if (taskFrom.status == 'NOT_BEGIN') {
		toStatus.value = 'DONE';
	} else {
		toStatus.value = 'NOT_BEGIN';
	}
};

/**
 * close renew callback
 * @param {String} type
 */
const closeRenew = (type) => {
	renewVisible.value = false;
	if (type == 'renew') {
		emit("successChange");
		emit('saveCurTaskId', null);
	}
};

/**
 * handle open task trace event
 */
const handleTaskTrace = () => {
	map.visible = true;
	map.taskId = taskFrom.id;
};

/**
 * handle close task trace callback event
 */
const closeMap = () => {
	map.visible = false;
};

/**
 * handle schedule event
 */
const handleSchedule = () => {
	if (taskFrom.openSchedule) {
		taskFrom.openSchedule = !taskFrom.openSchedule;
	} else {
		dialog.visible = true;
		dialog.title = '插入钉钉日程';
		dialog.content = '确定对该任务所有相关人员插入钉钉日程吗？';
		dialog.type = 'schedule';
	}
};

/**
 * handle cycle select change event
 */
const cycleChange = (value) => {
	taskFrom.loopType.type = value;
};

/**
 * handle select custom cycle event
 */
const handleCustomCycle = () => {
	customCycleShow.value = true;
	customCycleValue.value = '';
};

/**
 * handle confirm cycle event
 */
const handleConfirmCycle = () => {
	customCycleShow.value = false;
	taskFrom.cycleValue = ['每' + customCycleValue.value + '天'];
	taskFrom.loopType.type = 'CUSTOM_CYCLE';
	taskFrom.loopType.value = customCycleValue.value;
};

/**
 * handle close custom box event when click other area
 * @param {Event} event
 */
const closeCustomBox = (event) => {
	if (!customCycleShow.value) return;
	let cDom = document.getElementsByClassName('cycle-custom-box')[0];
	let tDom = event.target;
	if (cDom != tDom && !cDom.contains(tDom) && customCycleShow.value) {
		customCycleShow.value = false;
	}
};
/*
 * 如果是全局配置中配置了"允许参与人修改截止时间"，并且是任务参与人
 * 则可以修改时间
 * */
const checkCanUpdateTime = (role) => {
	console.log('当前任务角色：' + role);
	const ls = localStorage.getItem('QCP_GLOBAL_CFG');
	const lsObj = JSON.parse(ls);
	const open = lsObj?.abortTimePowerCommand?.open;
	return open;
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

/**
 * oss upload callback event
 */
const startUpload = () => {
	spinning.value = true;
};
const endUpload = (ossArr) => {
	taskFrom.accessory.ossAccessory.push(...ossArr);
	spinning.value = false;
};

/**
 * confirm start time callback
 * @param {String} time
 */
const confirmStartTime = (time) => {
	taskFrom.startTime = time;
};

/**
 * judge disabled deadline date
 * @param {Date} data
 */
const disabledDeadDate = (data) => {
	return data <= dayjs(taskFrom.startTime);
};

/**
 * judge disabled start date
 * @param {Date} data
 */
const disabledStartDate = (data) => {
	return dayjs(taskFrom.abortTime) <= data;
};

/**
 * handle check files list event
 */
const handleCheckFiles = () => {
	files.show = true;
	files.accessory = taskFrom.accessory;
};

/**
 * close commentFileModal event
 */
const hideCommentFiles = () => {
	files.show = false;
};

/**
 * handle download current file event
 * @param {object} file current file data
 */
const handleDownloadFile = (file) => {
	const originalUrl = file.originalUrl;
	const fileName = file.fileName;
	if (dd.env.platform != 'notInDingTalk') {
		dd &&
			dd.ready(function () {
				dd.biz.util.downloadFile({
					url: originalUrl,
					name: fileName,
					onProgress: function (msg) { },
					onSuccess: function (result) { },
					onFail: function () { },
				});
			});
	} else {
		window.open(originalUrl);
	}
};

/**
 * return random id
 */
const returnSnow = () => {
	// const bizId = new Snowflake(1n, 1n, 0n).nextId().toString();
	const bizId = Date.now().toString() + props.curUser.userId;
	return bizId;
};

/**
 * get relevance count event
 */
const getRelevanceCnt = async () => {
	let type = '';
	if (props.taskDetail.type === 'MAIN_TASK') {
		type = 'TASK_MAIN';
	} else {
		type = 'TASK_SUB';
	}
	const { code, data } = await GET_RELEVANCE_CNT({
		taskId: props.taskDetail.id,
		relevanceType: type,
	});
	if (code === 1) {
		console.log(data);
		relationArr.value = data;
	}
};

/**
 * handle add link callback
 * @param {Object} data 
 */
const relationConfirm = (data) => {
	relationCallback.value = data;
};

/**
 * handle click add relation event
 */
const handleAddRelation = () => {
	relation.info.id = props.taskDetail.id;
	relation.visible = true;
};

/**
 * render relation text
 */
const renderCorText = () => {
	let projects = 0;
	let okrs = 0;
	if (relationArr.value && relationArr.value.length > 0) {
		relationArr.value.map(el => {
			el.relevanceCount.map(i => {
				if (i.category === "OKR") {
					projects += i.count;
				}
				if (i.category === "OKR") {
					okrs += i.count;
				}
			})
		})
	}
	if (projects + okrs > 0) {
		return `已关联${projects > 0 ? `${projects}个项目` : ''}${projects > 0 && okrs > 0 ? '、' : ''}${okrs > 0 ? `${okrs}个OKR` : ''}`
	} else {
		return ""
	}
};

/**
 * handle check relation event
 */
const handleCheckRelation = () => {
	lookRelation.info.avatar = props.taskDetail.createUser.avatar;
	lookRelation.info.content = props.taskDetail.content;
	lookRelation.info.id = props.taskDetail.id;
	lookRelation.info.name = props.taskDetail.createUser.name;
	lookRelation.info.status = props.taskDetail.status;
	lookRelation.info.type = props.taskDetail.type === 'MAIN_TASK' ? 'TASK_MAIN' : "TASK_SUB"
	lookRelation.visible = true;
};

/**
 * handle check relation detail event
 * @param {Object} item 
 * @param {String} type 
 */
const lookDetailCallback = (item, type) => {
	emit("checkRelationDetail", item, type);
}

const {
	content,
	createUser,
	principalUser,
	abortTime,
	remindType,
	subTasks,
	openSchedule,
	forCreateUser,
	dayFormat,
	selectArr,
	role,
	status,
	created,
	cycleValue,
	startTime,
	accessory,
} = toRefs(taskFrom);
</script>

<script>
export default {
	name: 'TaskDetail',
	components: {
		VNodes: (_, { attrs }) => {
			return attrs.vnodes;
		},
	},
};
</script>

<style lang="less">
@import './taskDetail.less';
</style>
