<template>
  <a-modal
    :visible="visible"
    title="关键事件"
    width="780"
    wrapClassName="event-box"
    :keyboard="false"
    :destroyOnClose="true"
    :maskClosable="false"
    :centered="true"
    :footer="null"
    @cancel="handleEventCancel"
  >
    <a-spin :spinning="spinning">
      <div class="key-body">
        <div class="key-box" v-for="(item, index) in keyList" :key="index">
          <div class="key-top">
            <div class="key-user">
              <avatarVue :userData="returnAva(item, 'avatar')" />
              <span class="key-tag">{{ returnRole(item) }}</span>
            </div>
            <span class="key-time" v-if="item.created">{{
              sliceSS(item.created)
            }}</span>
          </div>
          <div class="des-main">
            <div class="key-content" v-html="returnContent(item)"></div>
            <span
              class="appendix-span"
              v-if="item.label?.accessory"
              @click="handleFiles(item.label?.accessory)"
            >
              <iconpark-icon
                name="fujian"
                class="appendix-icon"
              ></iconpark-icon>
              附件{{ returnFileNum(item.label?.accessory) }}个
            </span>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
  <!-- files list component -->
  <FileListVue
    :appendixShow="appendix.appendixShow"
    :accessory="appendix.accessory"
    @hideFiles="hideFiles"
  />
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { QUERY_KEY_EVENTS } from "../../api";
import { sliceSS } from "../../utils/utils";
import avatarVue from "../avatar/avatar.vue";
import FileListVue from "../fileList/FileList.vue";

const props = defineProps({
  visible: Boolean,
  taskId: Number,
  curUser: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(["closeEvent"]);

const keyList = ref([]); //save key event list
const spinning = ref(false); //control spin status
const appendix = reactive({
  appendixShow: false,
  accessory: {},
});

watch(
  () => props.visible,
  (val, oldVal) => {
    if (val) {
      queryKeyEvent();
    }
  }
);

/**
 * handle close component event
 */
const handleEventCancel = () => {
  emit("closeEvent");
};

/**
 * query key event data
 */
const queryKeyEvent = async () => {
  spinning.value = true;
  keyList.value = [];
  let id = props.taskId;
  const { code, data } = await QUERY_KEY_EVENTS({
    id,
  });
  if (code === 1) {
    data.forEach((el) => {
      let item = {};
      item.type = el.type;
      item.label = el[el.type];
      item.created = el.created;
      keyList.value.push(item);
    });
    spinning.value = false;
  }
};

/**
 * return current event avatar
 * @param {Object} item
 * @param {String} type
 * @return {String || Object}
 */
const returnAva = (item, type) => {
  let avatar = {};
  let name = "";
  switch (item.type) {
    case "allocationTask":
      return nameTemplate(item, type);
      break;
    case "createTask":
      if (item.label.role === "FOR_CREATE") {
        if (props.curUser.userId === item.label.createUser.userId) {
          avatar = item.label.forCreateUser;
          name = item.label.forCreateUser.name;
        } else {
          avatar = item.label.createUser;
          name = item.label.createUser.name;
        }
      } else {
        avatar = item.label.createUser;
        name = item.label.createUser.name;
      }
      if (type === "avatar") {
        return avatar;
      } else {
        return name;
      }
      break;
    case "deleteTask":
      return nameTemplate(item, type);
      break;
    case "updateTaskContent":
      return nameTemplate(item, type);
      break;
    case "updateTaskStatus":
      return nameTemplate(item, type);
      break;
    case "updateTaskUser":
      return nameTemplate(item, type);
      break;
    case "updateTaskAbortTime":
      return nameTemplate(item, type);
      break;
    case "urgeTask":
      return nameTemplate(item, type);
      break;
    default:
      return;
  }
};

/**
 * return name and avatar template
 * @param {Object} item
 * @param {String} type
 * @return {Object || String} avatar || name
 */
const nameTemplate = (item, type) => {
  let avatar = {};
  let name = "";
  if (item.label.role === "FOR_CREATE") {
    if (props.curUser.userId === item.label.createUser.userId) {
      avatar = item.label.forCreateUser;
      name = item.label.forCreateUser.name;
    } else {
      avatar = item.label.createUser;
      name = item.label.createUser.name;
    }
  } else if (item.label.role === "PRINCIPAL") {
    avatar = item.label.principalUser;
    name = item.label.principalUser.name;
  } else if (item.label.role === "CREATE") {
    avatar = item.label.createUser;
    name = item.label.createUser.name;
  } else {
    avatar = item.label.executeUser;
    name = item.label.executeUser.name;
  }
  if (type === "avatar") {
    return avatar;
  } else {
    return name;
  }
};

const returnContent = (item) => {
  let creator = "";
  let role = "";
  let executeUser = "";
  // let execs = "";
  switch (item.type) {
    case "allocationTask":
      if (
        item.role === "FOR_CREATE" &&
        item.label.createUser.userId === props.curUser.userId
      ) {
        role = "代创建人";
        creator = item.label.forCreateUser.name;
      } else if (item.label.role === "PRINCIPAL") {
        role = "负责人";
        creator = item.label.principalUser.name;
      } else {
        role = "创建人";
        creator = item.label.createUser.name;
      }
      let nameArr = [];
      item.label.allocUser.forEach((el) => {
        nameArr.push(el.name);
      });
      executeUser = nameArr.join("、");

      return `${role}“${creator}”将任务“${
        item.label.taskContent
      }”<span class="keyword-blue">分配给</span>“${executeUser}”</br>${
        item.label.abortTime == null
          ? "未设置截止时间"
          : `截止时间为：${sliceSS(item.label.abortTime)}`
      }`;
    case "createTask":
      if (
        item.label.forCreateUser != null &&
        item.label.createUser.userId === props.curUser.userId
      ) {
        role = "代创建人";
        creator = item.label.forCreateUser.name;
      } else {
        role = "创建人";
        creator = item.label.createUser.name;
      }
      // debugger
      return `“${creator}”<span class="keyword-blue">创建</span>了任务`;
    case "deleteTask":
      if (
        item.label.role === "FOR_CREATE" &&
        item.label.createUser.userId === props.curUser.userId
      ) {
        role = "代创建人";
        creator = item.label.forCreateUser.name;
      } else if (item.label.role === "PRINCIPAL") {
        role = "负责人";
        creator = item.label.principalUser.name;
      } else {
        role = "创建人";
        creator = item.label.createUser.name;
      }
      executeUser = item.label.executeUser.name;
      return `${role}“${creator}”<span class="keyword-red">删除</span>了执行人“${executeUser}”及任务“${item.label.content}”`;
    case "updateTaskAbortTime":
      if (
        item.label.role === "FOR_CREATE" &&
        item.label.createUser.userId === props.curUser.userId
      ) {
        role = "代创建人";
        creator = item.label.forCreateUser.name;
      } else if (item.label.role === "PRINCIPAL") {
        role = "负责人";
        creator = item.label.principalUser.name;
      } else {
        role = "创建人";
        creator = item.label.createUser.name;
      }
      let execArr = [];
      item.label.executeUser.forEach((el) => {
        execArr.push(el.name);
      });
      executeUser = execArr.join("、");
      return `${role}“${creator}”将参与人“${executeUser}”的任务“${
        item.label.executeTaskContent
      }”截止时间由${
        item.label.oldTime == null ? "空" : sliceSS(item.label.oldTime)
      }<span class="keyword-blue">修改为</span>${
        item.label.newTime == null ? "空" : sliceSS(item.label.newTime)
      }`;
    case "updateTaskContent":
      if (
        item.label.role === "FOR_CREATE" &&
        item.label.createUser.userId === props.curUser.userId
      ) {
        role = "代创建人";
        creator = item.label.forCreateUser.name;
      } else if (item.label.role === "PRINCIPAL") {
        role = "负责人";
        creator = item.label.principalUser.name;
      } else {
        role = "创建人";
        creator = item.label.createUser.name;
      }
      if (item.label?.executeUser) {
        executeUser = item.label.executeUser.name;
        return `${role}“${creator}”将参与人“${executeUser}”的任务“${item.label.oldContent}”<span class="keyword-blue">修改为</span>“${item.label.newContent}”`;
      } else {
        return `${role}“${creator}”将任务“${item.label.oldContent}”<span class="keyword-blue">修改为</span>“${item.label.newContent}”`;
      }

    case "updateTaskUser":
      if (
        item.label.role === "FOR_CREATE" &&
        item.label.createUser.userId === props.curUser.userId
      ) {
        role = "代创建人";
        creator = item.label.forCreateUser.name;
      } else if (item.label.role === "PRINCIPAL") {
        role = "负责人";
        creator = item.label.principalUser.name;
      } else {
        role = "创建人";
        creator = item.label.createUser.name;
      }
      let oldArr = [];
      let newArr = [];
      item.label.oldUser.forEach((el) => {
        oldArr.push(el.name);
      });
      item.label.newUser.forEach((el) => {
        newArr.push(el.name);
      });
      return `${role}“${creator}”将任务“${
        item.label.content
      }”的参与人由“${oldArr.join(
        "、"
      )}”<span class="keyword-blue">修改为</span>“${newArr.join("、")}”`;
    case "updateTaskStatus":
      if (item.label.role === "FOR_CREATE") {
        if (item.label.createUser.userId === props.curUser.userId) {
          role = "代创建人";
          creator = item.label.forCreateUser.name;
        } else {
          role = "创建人";
          creator = item.label.createUser.name;
        }
      } else if (item.label.role === "PRINCIPAL") {
        role = "负责人";
        creator = item.label.principalUser.name;
      } else if (item.label.role === "CREATE") {
        role = "创建人";
        creator = item.label.createUser.name;
      } else {
        role = "参与人";
        creator = item.label.executeUser.name;
      }
      return `${role}“${creator}”将任务“${
        item.label.content
      }”状态由“${returnTaskMark(
        item.label.oldStatus
      )}”<span class="keyword-blue">修改为</span>“${returnTaskMark(
        item.label.newStatus
      )}”</br>${
        item.label.description == null || item.label.description == ""
          ? ""
          : `更新说明：${item.label.description}`
      }`;
    case "urgeTask":
      if (item.label.role === "FOR_CREATE") {
        if (item.label.createUser.userId === props.curUser.userId) {
          role = "代创建人";
          creator = item.label.forCreateUser.name;
        } else {
          role = "创建人";
          creator = item.label.createUser.name;
        }
      } else if (item.label.role === "PRINCIPAL") {
        role = "负责人";
        creator = item.label.principalUser.name;
      } else if (item.label.role === "CREATE") {
        role = "创建人";
        creator = item.label.createUser.name;
      } else {
        role = "参与人";
        creator = item.label.executeUser.name;
      }
      let users = [];
      item.label.rightUser.map(el => {
        users.push(el.name)
      })
      return `${role}“${creator}”<span class="keyword-blue">催办了</span>${users.join('、')}的任务“${item.label.content}”`;
    default:
      return;
  }
};

/**
 * return task mark
 * @param {String} type
 * @return {String} task status
 */
const returnTaskMark = (type) => {
  switch (type) {
    case "NOT_BEGIN":
      return "未开始";
    case "NOT_BEGIN":
      return "未完成";
    case "DONE":
      return "已完成";
    case "TERMINATION":
      return "已终止";
    default:
      return;
  }
};

/**
 * return current user role
 * @param {Object} item
 */
const returnRole = (item) => {
  let role = "";
  switch (item.type) {
    case "allocationTask":
      if (
        item.role === "FOR_CREATE" &&
        item.label.createUser.userId === props.curUser.userId
      ) {
        role = "代创建人";
      } else if (item.label.role === "PRINCIPAL") {
        role = "负责人";
      } else {
        role = "创建人";
      }
      return role;
    case "createTask":
      if (
        item.label.forCreateUser != null &&
        item.label.createUser.userId === props.curUser.userId
      ) {
        role = "代创建人";
      } else {
        role = "创建人";
      }
      return role;
    case "deleteTask":
      if (
        item.label.role === "FOR_CREATE" &&
        item.label.createUser.userId === props.curUser.userId
      ) {
        role = "代创建人";
      } else if (item.label.role === "PRINCIPAL") {
        role = "负责人";
      } else {
        role = "创建人";
      }
      return role;
    case "updateTaskAbortTime":
      if (
        item.label.role === "FOR_CREATE" &&
        item.label.createUser.userId === props.curUser.userId
      ) {
        role = "代创建人";
      } else if (item.label.role === "PRINCIPAL") {
        role = "负责人";
      } else {
        role = "创建人";
      }
      return role;
    case "updateTaskContent":
      if (
        item.label.role === "FOR_CREATE" &&
        item.label.createUser.userId === props.curUser.userId
      ) {
        role = "代创建人";
      } else if (item.label.role === "PRINCIPAL") {
        role = "负责人";
      } else {
        role = "创建人";
      }
      return role;
    case "updateTaskUser":
      if (
        item.label.role === "FOR_CREATE" &&
        item.label.createUser.userId === props.curUser.userId
      ) {
        role = "代创建人";
      } else if (item.label.role === "PRINCIPAL") {
        role = "负责人";
      } else {
        role = "创建人";
      }
      return role;
    case "updateTaskStatus":
      if (item.label.role === "FOR_CREATE") {
        if (item.label.createUser.userId === props.curUser.userId) {
          role = "代创建人";
        } else {
          role = "创建人";
        }
      } else if (item.label.role === "PRINCIPAL") {
        role = "负责人";
      } else if (item.label.role === "CREATE") {
        role = "创建人";
      } else {
        role = "参与人";
      }
      return role;
    case "urgeTask":
      if (item.label.role === "FOR_CREATE") {
        if (item.label.createUser.userId === props.curUser.userId) {
          role = "代创建人";
        } else {
          role = "创建人";
        }
      } else if (item.label.role === "PRINCIPAL") {
        role = "负责人";
      } else if (item.label.role === "CREATE") {
        role = "创建人";
      } else {
        role = "参与人";
      }
      return role;
    default:
      return;
  }
};

/**
 * handle check appendix
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
</script>

<style lang="less">
@import "./keyEvent.less";
</style>