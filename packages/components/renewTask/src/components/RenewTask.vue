<template>
    <a-modal :visible="renewVisible" title="更新说明" :keyboard="false" width="780" okText="确定" cancelText="取消"
        wrapClassName="renew-box" :destroyOnClose="true" :maskClosable="false" :centered="true" :zIndex="zIndex"
        :okButtonProps="{ disabled: judgeStrNull(inputVal), loading: btnLoading }" :cancelButtonProps="{
            class: 'cancel-btn'
        }" :afterClose="afterClose" @ok="handleOkEvent" @cancel="handleCancelEvent">
        <!-- input box -->
        <a-textarea v-model:value="inputVal" placeholder="请填写任务更新说明" :auto-size="{ minRows: 7 }" show-count
            :maxlength="150" :autoFocus="true" />
        <!-- upload btn box -->
        <div class="upload-box">
            <!-- oss upload -->
            <OssUploadVue :taskId="dragEl.id" @startUpload="startUpload" @endUpload="endUpload">
                <div class="upload-btn">
                    <iconpark-icon name="uploadIcon" class="btn-icon"></iconpark-icon>
                    <span class="btn-text">添加本地文件</span>
                </div>
            </OssUploadVue>
            <!-- dd upload -->
            <DDUploadVue @ddStartUpload="ddStartUpload" @ddEndUpload="ddEndUpload">
                <div class="upload-btn">
                    <iconpark-icon name="uploadIcon" class="btn-icon"></iconpark-icon>
                    <span class="btn-text">添加钉盘文件</span>
                </div>
            </DDUploadVue>
        </div>
        <!-- upload files list box -->
        <a-spin :spinning="spinning" size="large">
            <div class="file-box">
                <template v-if="dingDishAccessoryList?.length > 0">
                    <div class="dd-files" v-for="item in dingDishAccessoryList" :key="item.fileId"
                        @click="handleDDPreview(item)">
                        <img class="file-img" src="https://daily-static-file.oss-cn-shanghai.aliyuncs.com/file-icon.svg"
                            alt="" />
                        <span class="file-name">{{ item.fileName }}</span>
                        <iconpark-icon name="delete" class="delete-icon"
                            @click.stop="deleteFile(dingDishAccessoryList, item.fileId, 'dd')"></iconpark-icon>
                    </div>
                </template>
                <template v-if="ossAccessoryList?.length > 0">
                    <div class="oss-files" v-for="item in ossAccessoryList" :key="item.ossMaterialId">
                        <a-image v-if="returnType(item.cname)" class="file-img" :src="item.originalUrl">
                            <template #previewMask>
                                <iconpark-icon name="preview"></iconpark-icon>
                            </template>
                        </a-image>
                        <img v-else class="file-img"
                            src="https://daily-static-file.oss-cn-shanghai.aliyuncs.com/file-icon.svg" alt="" />
                        <template v-if="returnType(item.cname)">
                            <a-image class="preview-img" :style="{ display: 'none' }" :previewMask="false" :preview="{
                                visible: imgVisible,
                                onVisibleChange: setVisible,
                            }" :src="item.originalUrl" />
                        </template>
                        <span class="file-name" @click="() => setVisible(true)">{{
                            item.fileName
                        }}</span>
                        <iconpark-icon name="delete" class="delete-icon"
                            @click.stop="deleteFile(ossAccessoryList, item.ossMaterialId, 'oss')"></iconpark-icon>
                    </div>
                </template>
            </div>
        </a-spin>
    </a-modal>
</template>

<script setup>
import { reactive, ref, toRefs, watch } from "vue";
import {
    RENEW_TASK_STATUS,
    QUERY_CORP_SPACE,
    QUERY_DD_PERMISSION,
} from "../api";
import { getQueryVariable, judgeStrNull } from "../utils/utils";
import { message } from "ant-design-vue";
import * as dd from "dingtalk-jsapi";
import OssUploadVue from "@/components/upload/index";
import DDUploadVue from "@/components/ddUpload/index";

defineOptions({
	name: 'RenewTask',
});

const G_corpId = getQueryVariable("corpId");
const props = defineProps({
    renewVisible: Boolean,
    dragEl: Object,
    toStatus: String,
    zIndex: {
        type: Number,
        default: 1000,
        required: false
    }
});
const emit = defineEmits(["closeRenew"]);
const inputVal = ref(""); //save input val
const spinning = ref(false); //control loading status
const spaceId = ref(""); //save current space id
const btnLoading = ref(false); //save btn loading status
const imgVisible = ref(false); //control img preview
const accessory = reactive({
    ossAccessoryList: [],
    dingDishAccessoryList: [],
});
watch(
    () => props.renewVisible,
    (val, oldVal) => {
        if (val) {
            accessory.dingDishAccessoryList = [];
            accessory.ossAccessoryList = [];
        }
    }
);
/**
 * handle preview img
 * @param {Boolean} val
 */
const setVisible = (val) => {
    imgVisible.value = val;
};
/**
 * handle model click ok event
 */
const handleOkEvent = () => {
    renewStatus();
};
/**
 * handle model click cancel event
 */
const handleCancelEvent = () => {
    emit("closeRenew", "close");
};
/**
 * handle renew task status event
 */
const renewStatus = async () => {
    btnLoading.value = true;
    let taskId = props.dragEl.id;
    let status = props.toStatus;
    let taskDescription = inputVal.value;
    accessory.ossAccessoryList.forEach((el) => {
        el.ossId = el.ossMaterialId;
    });
    const { data, code } = await RENEW_TASK_STATUS({
        taskId,
        status,
        taskDescription,
        accessory,
    });
    if (code === 1) {
        btnLoading.value = false;
        switch (status) {
            case "DONE":
                if (props.dragEl.loopType?.type != 'NOT_REPEAT') {
                    if (data) {
                        message.success("任务已完成，已生成下一个循环任务");
                    } else {
                        message.success("任务已完成，将会在新的周期生成循环任务");
                    }
                } else {
                    message.success("任务已完成");
                }
                break;
            case "TERMINATION":
                message.success("任务已终止");
                break;
            case "NOT_BEGIN":
                message.success("任务已重启");
                break;
        }
        emit("closeRenew", "renew");
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
};
/**
 * upload dd start callback
 */
const ddStartUpload = () => {
    spinning.value = true;
};
/**
 * upload dd end callback
 * @param {Array} ddArr
 */
const ddEndUpload = (ddArr) => {
    spinning.value = false;
    accessory.dingDishAccessoryList = ddArr;
};
/**
 * delete current file
 * @param {Number} id
 */
const deleteFile = (arr, id, type) => {
    arr.forEach((el, index) => {
        if (el.fileId === id && type === "dd") {
            arr.splice(index, 1);
        }
        if (el.id === id && type === "oss") {
            arr.splice(index, 1);
        }
    });
};
/**
 * judge oss upload file type did img
 * @param {String} cname
 */
const returnType = (cname) => {
    let type = cname.split(".")[1];
    if (type == "png" || type == "jpg" || type == "jpeg") {
        return true;
    } else {
        return false;
    }
};
/**
 * handle preview current dd file event
 * @param {Object} item
 */
const handleDDPreview = async (item) => {
    await queryDDSpaceId();
    await ddPermission("preview", item);
};
/**
 * query corp space id
 * @param {String} spaceId
 */
const queryDDSpaceId = async () => {
    const { code, data } = await QUERY_CORP_SPACE({});
    if (code === 1) {
        spaceId.value = data;
    }
};
/**
 * get dd space permission
 * @param {String} spaceId
 */
const ddPermission = async (type, item = {}) => {
    const { code } = await QUERY_DD_PERMISSION({
        type: type,
        fileIds: ["0"],
        duration: 3600,
        spaceId: spaceId.value,
    });
    if (code === 1) {
        previewDDFile(item);
    }
};
/**
 * preview current file event
 * @param {Object} item current file data
 */
const previewDDFile = (item) => {
    dd.biz.cspace.preview({
        corpId: G_corpId,
        spaceId: item.spaceId,
        fileId: item.fileId,
        fileName: item.fileName,
        fileSize: item.fileSize,
        fileType: item.fileType,
        onSuccess: function (res) {
        },
        onFail: function (err) {
            console.log(err);
        },
    });
};
const afterClose = () => {
    inputVal.value = "";
};
const { ossAccessoryList, dingDishAccessoryList } = toRefs(accessory);
</script>

<style lang="less">
@import "./renewTask.less";
</style>
