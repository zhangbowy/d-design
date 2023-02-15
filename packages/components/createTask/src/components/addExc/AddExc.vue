<template>
  <a-modal
    :visible="visible"
    title="添加参与人"
    :keyboard="false"
    width="780"
    okText="确定"
    cancelText="取消"
    wrapClassName="add-exc-box"
    :destroyOnClose="true"
    :maskClosable="false"
    :centered="true"
    :okButtonProps="{ disabled: (!content || executeUser?.length == 0) }"
    @ok="handleOkEvent"
    @cancel="handleCancelEvent"
  >
    <!-- add exc task box -->
    <div class="exc-task">
      <div class="public-title">
        <span class="public-icon">*</span>
        <span class="public-text">任务内容</span>
      </div>
      <!-- input box -->
      <a-textarea
        v-model:value="content"
        placeholder="请填写任务内容"
        :auto-size="{ minRows: 4 }"
        show-count
        :maxlength="150"
        :autoFocus="true"
        :disabled="isDisable"
      />
    </div>
    <!-- add exc box -->
    <div class="exc-box">
      <div class="public-title">
        <span class="public-icon">*</span>
        <span class="public-text">参与人</span>
      </div>
      <div class="exc-list" :class="{'dis-bgc': isDisable}" @click="!isDisable && handleAddExc()">
        <span v-if="executeUser?.length == 0" class="empty-text">请选择</span>
        <div class="exc-block" v-for="item in executeUser" :key="item.userId" @click.stop>
          <AvatarVue :userData="item" />
          <iconpark-icon
            name="guanbi"
            class="close-icon"
            @click.stop="!isDisable && handleDeleteUser(item.userId)"
          ></iconpark-icon>
        </div>
        <iconpark-icon name="right" class="more-icon"></iconpark-icon>
      </div>
    </div>
    <!-- add exc abortTime -->
    <div class="exc-abort-time">
      <div class="public-title">
        <span class="public-text">任务截止时间</span>
      </div>
      <a-date-picker
        v-model:value="dayFormat"
        format="YYYY-MM-DD HH:mm"
        placeholder="请选择"
        :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:00') }"
        :allowClear="false"
        :autofocus="false"
        :showNow="false"
        :locale="locale"
        :disabled="isDisable"
        @ok="confirmAbortTime"
      >
      </a-date-picker>
      <iconpark-icon
        v-if="dayFormat"
        name="delete"
        @click="!isDisable && handleDeleteDeadline()"
        class="delete-icon"
      ></iconpark-icon>
    </div>
  </a-modal>
  <!-- choose user component -->
  <ChooseUserVue
    :visible="choose.visible"
    :searchAllZone="choose.searchAllZone"
    :multiSelect="choose.multiSelect"
    :title="choose.title"
    :selectedUsers="choose.selectedUsers"
    @updateUserIds="updateUserIds"
    @close="handleChooseClose"
  />
  <!-- dialog component -->
  <DialogVue
    :dialogVisible="dialog.visible"
    :title="dialog.title"
    :content="dialog.content"
    @cancelEvent="cancelEvent"
    @okEvent="okEvent"
  />
</template>

<script setup>
import { ref, reactive, toRefs, watch } from "vue";
import { formatDate, checkNullObj } from "../../utils/utils";
import dayjs from "dayjs";
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
import AvatarVue from "../avatar/avatar.vue";
import ChooseUserVue from "../../../../chooseuser/components/index1.vue";
import DialogVue from "../dialog/Dialog.vue";

const props = defineProps({
  visible: Boolean,
  subTask: {
    type: Object,
    required: false,
  },
  isDisable: {
    type: Boolean,
    required: false,
    defaultValue: false
  }
});

const emit = defineEmits(["closeAddExc", "addExc"]);

const excFrom = reactive({
  content: "",
  executeUser: [],
  abortTime: null,
  leaderAbortTime: "",
  id: null,
  groupId: null,
  index: null,
}); //subtask from data

const choose = reactive({
  visible: false,
  searchAllZone: true,
  multiSelect: true,
  title: "",
  selectedUsers: [],
}); //control chose user component
const dialog = reactive({
  visible: false,
  title: "",
  content: "",
}); //save dialog data
const cache = reactive({
  openData: null,
  closeData: null
})

const dayFormat = ref(undefined); //save dayjs format

watch(
  () => props.visible,
  (val, oldVal) => {
    if(val) {
      initData();
    }
  }
)

/**
 * init data
 */
const initData = () => {
  if (!checkNullObj(props.subTask)) {
    excFrom.content = props.subTask.content;
    excFrom.abortTime = props.subTask.abortTime;
    excFrom.executeUser = props.subTask.executeUser;
    excFrom.groupId = props.subTask.groupId;
    excFrom.id = props.subTask.id;
    excFrom.leaderAbortTime = "";
    excFrom.index = props.subTask.index;
    dayFormat.value = props.subTask.abortTime ? dayjs(props.subTask.abortTime) : undefined;
  } else {
    excFrom.content = "";
    excFrom.abortTime = null;
    excFrom.executeUser = [];
    excFrom.groupId = null;
    excFrom.id = null;
    excFrom.index = null;
    excFrom.leaderAbortTime = "";
    dayFormat.value = undefined;
  }
  cache.openData = JSON.stringify(excFrom)
};

/**
 * handle modal ok event
 */
const handleOkEvent = () => {
  if(props.isDisable) {
    emit("closeAddExc");
    return
  }
  excFrom.leaderAbortTime = excFrom.abortTime;
  excFrom.index = excFrom.index || Date.now();
  emit("addExc", {...excFrom});
};

/**
 * handle modal cancel event
 */
const handleCancelEvent = () => {
  cache.closeData = JSON.stringify(excFrom);
  if(props.isDisable || (cache.openData === cache.closeData)) {
    emit("closeAddExc");
  } else {
    dialog.visible = true;
    dialog.title = "关闭";
    dialog.content = `确定放弃${checkNullObj(props.subTask) ? '添加' : '修改'}参与人吗？`;
  }
};

/**
 * handle add executer event
 */
const handleAddExc = () => {
  choose.visible = true;
  choose.title = "请选择参与人";
  choose.selectedUsers = excFrom.executeUser;
};

/**
 * choose user component callback
 * @param {Array} arr
 */
const updateUserIds = (arr) => {
  excFrom.executeUser = arr;
  choose.visible = false;
};

/**
 * close choose user callback
 */
const handleChooseClose = () => {
  choose.visible = false;
};

/**
 * handle delete current user
 * @param {String} userId
 */
const handleDeleteUser = (userId) => {
  let index = excFrom.executeUser.findIndex((el) => el.userId === userId);
  excFrom.executeUser.splice(index, 1);
};

/**
 * handle confirm abort time event
 * @param {Date} date
 */
const confirmAbortTime = (date) => {
  excFrom.abortTime = formatDate(new Date(date));
  dayFormat.value = dayjs(excFrom.abortTime);
};

/**
 * handle delete abort time event
 */
const handleDeleteDeadline = () => {
  excFrom.abortTime = null;
  dayFormat.value = undefined;
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
  emit("closeAddExc");
};

const { content, executeUser, abortTime } = toRefs(excFrom);
</script>

<style lang="less">
@import "./addExc.less";
</style>