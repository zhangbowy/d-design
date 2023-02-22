<template>
	<a-drawer
		:visible="visible"
		class="add-task-drawer"
		placement="right"
		:title="title"
		:width="width"
		:keyboard="false"
		:maskClosable="false"
		:destroyOnClose="true"
		@close="handleDrawerClose">
		<!-- input box -->
		<div class="content-box">
			<a-textarea
				v-model:value="content"
				placeholder="请填写任务内容"
				:auto-size="{minRows: 5}"
				:maxlength="150"
				:autoFocus="true" />
			<a-spin :spinning="spinning">
				<div class="upload-box">
					<div class="file-box">
						<div
							class="file-list"
							v-for="item in accessory.ossAccessoryList"
							:key="item.ossMaterialId"
							@click="handleDownloadFile(item)">
							<a-image
								v-if="returnType(item.cname)"
								class="file-img"
								:src="item.originalUrl"
								@click.stop>
								<template #previewMask>
									<iconpark-icon name="preview"></iconpark-icon>
								</template>
							</a-image>
							<img
								v-else
								class="file-img-not_img"
								src="https://daily-static-file.oss-cn-shanghai.aliyuncs.com/file-icon.svg"
								alt="" />
							<span class="file-name">{{ item.fileName }}</span>
							<iconpark-icon
								name="delete"
								class="delete-file-icon"
								@click.stop="
									deleteFile(
										accessory.ossAccessoryList,
										item.ossMaterialId,
										'oss'
									)
								"></iconpark-icon>
						</div>
					</div>
					<OssUploadVue
						class="upload-icon"
						:bizId="returnSnow()"
						@startUpload="startUpload"
						@endUpload="endUpload">
						<iconpark-icon class="icon" name="fujian"></iconpark-icon>
					</OssUploadVue>
				</div>
			</a-spin>
		</div>
		<!-- <Comment /> -->
		<!-- add creator box -->
		<div class="add-creator">
			<span class="public-title">创建人</span>
			<div class="public-box" @click="handleChooseUser('creator')">
				<div v-if="checkNullObj(createUser)" class="empty-text">选择创建人</div>
				<div v-else class="user-box">
					<AvatarVue :userData="createUser" />
				</div>
				<iconpark-icon name="right" class="right-icon"></iconpark-icon>
			</div>
		</div>
		<!-- add principal box -->
		<div class="add-principal">
			<span class="public-title">负责人</span>
			<div class="public-box" @click="handleChooseUser('principal')">
				<div v-if="checkNullObj(principalUser)" class="empty-text">
					选择负责人
				</div>
				<div v-else class="user-box">
					<AvatarVue :userData="principalUser" />
				</div>
				<iconpark-icon name="right" class="right-icon"></iconpark-icon>
			</div>
			<iconpark-icon
				v-if="!checkNullObj(principalUser)"
				name="delete"
				class="delete-icon"
				@click="handleDeletePri()"></iconpark-icon>
		</div>
		<!-- add start time box -->
		<div class="add-deadline">
			<span class="public-title">任务开始时间</span>
			<div class="deadline-box">
				<a-date-picker
					v-model:value="startTime"
					format="YYYY-MM-DD HH:mm"
					placeholder="选择时间"
					:show-time="{
						hideDisabledOptions: false,
						defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
					}"
					:allowClear="false"
					:autofocus="false"
					:showNow="false"
					:locale="locale"
					:disabledDate="disabledStartDate"
					@ok="confirmStartTime">
					<template v-slot:suffixIcon>
						<iconpark-icon name="right" class="right-icon"></iconpark-icon>
					</template>
				</a-date-picker>
			</div>
		</div>
		<div class="add-deadline">
			<span class="public-title">任务截止时间</span>
			<div class="deadline-box">
				<a-date-picker
					ref="datePicker"
					v-model:value="dayFormat"
					format="YYYY-MM-DD HH:mm"
					placeholder="选择时间"
					:show-time="{
						hideDisabledOptions: false,
						defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
					}"
					:allowClear="false"
					:autofocus="false"
					:showNow="false"
					:locale="locale"
					:disabledDate="disabledDeadDate"
					@ok="confirmDeadline">
					<template v-slot:suffixIcon>
						<iconpark-icon name="right" class="right-icon"></iconpark-icon>
					</template>
				</a-date-picker>
			</div>
			<iconpark-icon
				v-if="abortTime"
				name="delete"
				class="delete-icon"
				@click="handleDelAbortTime"></iconpark-icon>
		</div>
		<!-- add time remind -->
		<div class="add-remind" v-if="dayFormat != null">
			<!-- deadline remind box -->
			<div class="remind-box">
				<iconpark-icon name="tixing" class="remind-icon"></iconpark-icon>
				<span class="remind-text" v-if="returnListNum() == 0">暂无提醒</span>
				<div class="custom-list">
					<div class="add-remind-btn" @click="handleSelect">
						<iconpark-icon name="add" class="add-icon"></iconpark-icon>
						<a-select
							v-model:value="selectArr"
							mode="multiple"
							dropdownClassName="selector"
							:open="selectOpen"
							:dropdownMatchSelectWidth="false"
							@change="handleSelectChange"
							@blur="handleSelectBlur">
							<a-select-option
								class="remind-option"
								v-for="item in remindOptions.slice(0, 4)"
								:key="item.type"
								:value="item.type"
								>{{ item.customTime }}
							</a-select-option>
							<a-select-option class="custom-option">
								<div class="custom-time">
									<div class="custom-btn">+ 自定义</div>
									<a-date-picker
										format="YYYY-MM-DD HH:mm"
										dropdownClassName="picker"
										:show-time="{
											hideDisabledOptions: true,
											defaultValue: dayjs('00:00:00', 'HH:mm'),
										}"
										:allowClear="false"
										:autofocus="false"
										:showNow="false"
										:locale="locale"
										@openChange="handlePickerChange"
										@ok="confirmRemindDeadline">
									</a-date-picker>
								</div>
							</a-select-option>
						</a-select>
					</div>
					<template v-for="item in remindOptions" :key="item.customTime">
						<div class="custom-box" v-if="item.choose">
							<span>{{ item.customTime }}</span>
							<iconpark-icon
								name="guanbi"
								class="close-icon"
								@click="handleDeleteRemind(item)"></iconpark-icon>
						</div>
					</template>
				</div>
			</div>
			<!-- add-schedule -->
			<div class="schedule-box">
				<iconpark-icon name="richeng" class="remind-icon"></iconpark-icon>
				<span>插入钉钉日程</span>
				<a-switch :checked="openSchedule" @change="handleSchedule" />
			</div>
			<!-- add cycle -->
			<div v-if="trait === 'QZP'" class="cycle-box">
				<iconpark-icon name="loop" class="remind-icon"></iconpark-icon>
				<span class="cycle-title">任务循环</span>
				<a-select
					v-model:value="cycleValue"
					:dropdownMatchSelectWidth="false"
					@change="cycleChange"
					@focus="() => (customCycleShow = false)">
					<a-select-option
						class="cycle-option"
						v-for="item in cycleList"
						:key="item.type"
						:value="item.type"
						>{{ item.content }}</a-select-option
					>
					<template #dropdownRender="{menuNode: menu}">
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
					<a-button
						type="primary"
						:disabled="!customCycleValue"
						@click="handleConfirmCycle"
						>确 定</a-button
					>
				</div>
			</div>
		</div>
		<!-- add exc box -->
		<div class="add-exc">
			<span class="public-title">参与人</span>
			<div class="exc-list">
				<div class="exc-box" v-for="item in subTasks" :key="item.index">
					<div class="exc-main" @click="handleCheckExc(item)">
						<AvatarVue :userData="item.executeUser" />
						<div class="main-right">
							<div class="user-name">
								<span class="name-list">{{
									returnName(item?.executeUser)
								}}</span>
								<span v-if="item?.executeUser?.length > 2" class="name-length"
									>等{{ item?.executeUser?.length }}人</span
								>
								<iconpark-icon name="right" class="arrow-icon"></iconpark-icon>
							</div>
							<div class="task-data">
								<span v-if="item?.abortTime" class="deadline-time"
									>截止{{ returnTIme(item?.abortTime) }}</span
								>
								<span class="side-task-content">{{ item?.content }}</span>
							</div>
						</div>
					</div>
					<iconpark-icon
						name="delete"
						class="exc-delete"
						@click="handleDeleteSub(item.index)"></iconpark-icon>
				</div>
				<div class="add-remind-btn" @click="handleAddExc">
					<iconpark-icon name="add" class="add-icon"></iconpark-icon>
				</div>
			</div>
		</div>
		<!-- add correlation -->
		<div v-if="trait === 'OKR'" class="add-correlation">
			<span class="public-title">关联项</span>
			<div class="add-cor-btn" @click="handleAddRelation()">
				<iconpark-icon name="guanlian"></iconpark-icon>
				<span>添加关联</span>
			</div>
			<div class="cor-text" v-if="renderCorText()">
				<iconpark-icon name="guanlian"></iconpark-icon>
				<span>{{ renderCorText() }}</span>
			</div>
		</div>
		<!-- create task footer box -->
		<template #footer>
			<div class="add-footer">
				<a-button class="cancel-btn" @click="handleDrawerClose">取消</a-button>
				<a-button
					type="primary"
					class="sure-btn"
					:disabled="judgeStrNull(content) || spinning"
					:loading="loading"
					@click="handleCreateTask"
					>新建任务
				</a-button>
			</div>
		</template>
	</a-drawer>
	<!-- choose user component -->
	<ChooseUserVue
		:visible="choose.visible"
		:searchAllZone="choose.searchAllZone"
		:multiSelect="choose.multiSelect"
		:title="choose.title"
		:selectedUsers="choose.selectedUsers"
		@updateUserIds="updateUserIds"
		@close="handleChooseClose" />
	<!-- add executor component -->
	<AddExcVue
		:visible="addExcVisible"
		:subTask="curSubTask"
		@closeAddExc="closeAddExc"
		@addExc="addExc" />
	<!-- dialog component -->
	<DialogVue :dialogVisible="dialog.visible" :title="dialog.title" :content="dialog.content"
		@cancelEvent="cancelEvent" @okEvent="okEvent" />
	<Relation v-model:visible="relation.visible" :tabs="['OKR', 'PROJECT']" :isDirectAdd="false" :info="relation.info"
		@successCallback="relationConfirm" />
</template>

<script setup>
import {ref, reactive, toRefs, watch} from 'vue';
import {CREATE_TASK,CREATE_PROJECT_TASK, ADD_TASK_LINK} from '../../api';
import {checkNullObj, formatDate, judgeStrNull} from '../../utils/utils';
import {message} from 'ant-design-vue';
import dayjs from 'dayjs';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import AvatarVue from '../avatar/avatar.vue';
import ChooseUserVue from '../../../../chooseuser/components/index.vue';
import AddExcVue from '../addExc/AddExc.vue';
import DialogVue from '../dialog/Dialog.vue';
import OssUploadVue from '../../../../upload/index';
import Relation from '@/components/relation/index';
import * as dd from 'dingtalk-jsapi';

dayjs.locale('zh-cn');

const props = defineProps({
	visible: Boolean,
	curUser: {
		type: Object,
		required: true,
		default: {
			userId: 0,
		},
	},
	title: {
		type: String,
		default: '创建任务',
		required: false,
	},
	trait: {
		type: String, // OKR/PROJECT/INTE/QZP
		default: 'QZP',
		required: false,
	},
	projectId: {
		type: Number,
		default: 0,
		required: false,
	},
	menuId: {
		type: Number,
		default: 0,
		required: false,
	},
	width: {
		type: Number,
		default: 480,
	},
});
const emit = defineEmits(['closeDrawer', 'successCreate']);

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
	createUser: props.curUser,
	principalUser: {},
	abortTime: '',
	remindType: [],
	subTasks: [],
	openSchedule: false,
	forCreateUser: null,
	dayFormat: null,
	selectArr: [],
	cycleValue: ['NOT_REPEAT'],
	loopType: {
		value: 0,
		type: 'NOT_REPEAT',
	},
	accessory: {
		ossAccessoryList: [],
		dingDishAccessoryList: [],
	},
	startTime: dayjs(),
}); //save task form
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
const relation = reactive({
	visible: false,
	info: {
		id: 0,
		relevanceType: 'TASK_MAIN',
		relevanceCategory: 'TASK',
	},
});

const addExcVisible = ref(false); //control add executer component visible
const curSubTask = ref({}); //save current subtask
const loading = ref(false); //create task  loading
const selectOpen = ref(false); //select open
const tag = ref(false); //control select and date picker open
const customCycleShow = ref(false); //control custom cycle box visible
const customCycleValue = ref(''); //save custom cycle value
const spinning = ref(false);
// const hours = ref(Array.from(Array(24), (v, k) => k));
const hours = ref([]);
const mins = ref([]);
const datePicker = ref(null);
const relationCallback = ref({})
const cache = reactive({
	openData: null,
	closeData: null,
});

watch(
	() => props.visible,
	(val, oldVal) => {
		if (val) {
			taskFrom.abortTime = '';
			taskFrom.content = '';
			taskFrom.createUser = props.curUser;
			taskFrom.dayFormat = null;
			taskFrom.forCreateUser = null;
			taskFrom.openSchedule = false;
			taskFrom.principalUser = {};
			taskFrom.remindType = [];
			taskFrom.subTasks = [];
			taskFrom.selectArr = [];
			taskFrom.cycleValue = ['NOT_REPEAT'];
			taskFrom.loopType.type = 'NOT_REPEAT';
			taskFrom.loopType.value = 0;
			taskFrom.accessory.ossAccessoryList = [];
			taskFrom.startTime = dayjs();
			cache.openData = JSON.stringify(taskFrom);
			relationCallback.value = {};
			console.log(11111111)
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
	cache.closeData = JSON.stringify(taskFrom);
	if (cache.openData === cache.closeData) {
		emit('closeDrawer');
	} else {
		dialog.visible = true;
		dialog.title = '关闭';
		dialog.content = '关闭后填写内容将不会保存，确定关闭吗？';
		dialog.type = 'close';
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
 * confirm start time callback
 * @param {String} time
 */
const confirmStartTime = (time) => {
	taskFrom.startTime = time;
};
/**
 * handle delete abort time event
 */
const handleDelAbortTime = () => {
	taskFrom.abortTime = '';
	taskFrom.dayFormat = null;
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
	let num = -1;
	if (taskFrom.subTasks.length > 0) {
		num = taskFrom.subTasks.findIndex((el) => el.index == from.index);
	}
	if (num === -1) {
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
	nameArr?.forEach((el) => {
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
	let resCode = 0,
		resData = null;
	loading.value = true;
	remindOptions.value.forEach((el) => {
		if (el.choose && el.type != '00') {
			let item = {};
			item.type = el.type;
			taskFrom.remindType.push(item);
		} else if (el.choose && el.type == '00') {
			taskFrom.remindType.push(el);
		}
	});
	if (taskFrom.createUser.userId != props.curUser.userId) {
		taskFrom.forCreateUser = props.curUser;
	}
	taskFrom.accessory.ossAccessoryList.forEach((el) => {
		el.ossId = el.ossMaterialId;
	});
	if (props.trait == 'PROJECT') {
		const {code, data} = await CREATE_PROJECT_TASK({
			content: taskFrom.content,
			createUser: taskFrom.createUser,
			principalUser: taskFrom.principalUser,
			abortTime: taskFrom.abortTime,
			remindType: taskFrom.remindType,
			subTasks: taskFrom.subTasks,
			openSchedule: taskFrom.openSchedule,
			forCreateUser: taskFrom.forCreateUser,
			loopType: taskFrom.loopType,
			projectId: props.projectId,
			menuId: props.menuId,
			accessory: taskFrom.accessory,
			startTime: dayjs(taskFrom.startTime).format('YYYY-MM-DD HH:mm:00'),
		});
		resCode = code;
		resData = data;
	} else {
		const {code, data} = await CREATE_TASK({
			content: taskFrom.content,
			createUser: taskFrom.createUser,
			principalUser: taskFrom.principalUser,
			abortTime: taskFrom.abortTime,
			remindType: taskFrom.remindType,
			subTasks: taskFrom.subTasks,
			openSchedule: taskFrom.openSchedule,
			forCreateUser: taskFrom.forCreateUser,
			loopType: taskFrom.loopType,
			accessory: taskFrom.accessory,
			startTime: dayjs(taskFrom.startTime).format('YYYY-MM-DD HH:mm:00'),
		});
		resCode = code;
		resData = data;
	}
	if (resCode === 1) {
		if (
			props.trait === 'OKR' &&
			relationCallback.value?.targetInfo.length > 0
		) {
			relationCallback.value.sourceInfo.id = resData;
			//关联todo
			const {code} = await ADD_TASK_LINK({
				...relationCallback.value,
			});
			if (code === 1) {
				emit('successCreate');
				message.success('任务创建成功');
				loading.value = false;
			}
		} else {
			emit('successCreate');
			message.success('任务创建成功');
			loading.value = false;
		}
	} else {
		message.error('任务创建失败');
		loading.value = false;
		taskFrom.remindType = [];
	}
};
/**
 * handle dialog cancel event
 */
const cancelEvent = () => {
	dialog.visible = false;
};
/**
 * handle dialog ok event
 */
const okEvent = () => {
	dialog.visible = false;
	switch (dialog.type) {
		case 'close':
			emit('closeDrawer');
			break;
		case 'schedule':
			taskFrom.openSchedule = true;
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
 * cuttom time
 * */
const range = (start, end) => {
	const result = [];
	for (let i = start; i < end; i++) {
		result.push(i);
	}
	return result;
};
/*
 * handle deadline disabled time event
 * */
const disabledDeadlineHours = (type) => {
	let h = Array.from(Array(24), (v, k) => k);
	switch (type) {
		case 'deadline':
			return hours.value;
		case 'start':
			return hours.value;
	}
};
const disabledDeadlineMin = (type) => {
	let h = Array.from(Array(60), (v, k) => k);
	if (
		dayjs(taskFrom.abortTime).format('YYYY-MM-DD HH') ==
		dayjs(taskFrom.startTime).format('YYYY-MM-DD HH')
	) {
		mins.value = m.slice(0, dayjs(taskFrom.startTime).$m);
	}
	switch (type) {
		case 'deadline':
			return mins.value;
		case 'start':
			return mins.value;
	}
};

/**
 * handle deadline disabled time event
 * @param {string} dateType h/m
 * @param {string} timeType start/deadline
 */
const disabledRangeTime = () => {
	return {
		disabledHours: () => disabledDeadlineHours('deadline'),
		disabledMinutes: () => disabledDeadlineMin('deadline'),
	};
};

/**
 * oss upload callback event
 */
const startUpload = () => {
	spinning.value = true;
};
const endUpload = (ossArr) => {
	taskFrom.accessory.ossAccessoryList.push(...ossArr);
	spinning.value = false;
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
					onProgress: function (msg) {},
					onSuccess: function (result) {},
					onFail: function () {},
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
	relation.visible = true;
};

/**
 * render relation text
 */
const renderCorText = () => {
	let projects = 0;
	let okrs = 0;
	if (
		relationCallback.value.targetInfo &&
		relationCallback.value.targetInfo.length > 0
	) {
		relationCallback.value.targetInfo.map((el) => {
			if (el.relevanceCategory === 'PROJECT') {
				projects++;
			}
			if (el.relevanceCategory === 'OKR') {
				okrs++;
			}
		});
	}
	if (projects + okrs > 0) {
		return `已关联${projects > 0 ? `${projects}个项目` : ''}${
			projects > 0 && okrs > 0 ? '、' : ''
		}${okrs > 0 ? `${okrs}个OKR` : ''}`;
	} else {
		return '';
	}
};

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
	cycleValue,
	startTime,
	accessory,
} = toRefs(taskFrom);
</script>

<script>
export default {
	name: 'CreateTask',
	components: {
		VNodes: (_, {attrs}) => {
			return attrs.vnodes;
		},
	},
};
</script>
<style lang="less" scoped>
@import './addTask.less';
</style>
