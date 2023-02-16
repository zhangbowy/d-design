<template>
  <a-modal
    :visible="appendixShow"
    title="附件"
    width="780"
    wrapClassName="file-list-box"
    :keyboard="false"
    :destroyOnClose="true"
    :maskClosable="false"
    :centered="true"
    :footer="null"
    @cancel="handleFilesCancel"
  >
    <div class="appendix-detail">
      <!-- DD file list -->
      <div
        class="appendix-box"
        v-for="item in filesType?.dingDishAccessory"
        :key="item.fileId"
        @click.stop="previewFile(item)"
      >
        <div class="img-icon"></div>
        <span>
          {{ item.fileName }}
        </span>
      </div>
      <!-- oss files list -->
      <div
        class="appendix-box"
        v-for="item in filesType?.ossAccessory"
        :key="item.id"
      >
        <!-- @click.stop="previewOss(item)" -->
        <!-- <img class="oss-img" :src="item.originalUrl" alt="" /> -->
        <a-image v-if="item.type == 1" class="file-img" :src="item.originalUrl">
          <template #previewMask>
            <iconpark-icon name="preview"></iconpark-icon>
          </template>
        </a-image>
        <img
          v-else
          class="file-icon"
          src="https://daily-static-file.oss-cn-shanghai.aliyuncs.com/file-icon.svg"
          alt=""
        />
        <span>{{ item.fileName }}</span>
        <iconpark-icon
          name="xiazai"
          class="download-icon"
          @click.stop="downloadFile(item)"
        ></iconpark-icon>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { QUERY_CORP_SPACE, QUERY_DD_PERMISSION } from "../../api";
import { getQueryVariable } from "../../utils/utils";
import * as dd from "dingtalk-jsapi";

const G_corpId = getQueryVariable("corpId");

const props = defineProps({
  appendixShow: Boolean,
  accessory: Object,
});

const emit = defineEmits(["hideFiles"]);

const spaceId = ref("");
const filesType = reactive({
  dingDishAccessory: [],
  ossAccessory: [],
}); //save dd and oss files list

watch(
  () => props.appendixShow,
  (val, oldVal) => {
    if (val) {
      appendixOpen();
    }
  }
);

/**
 * handle close component event
 */
const handleFilesCancel = () => {
  emit("hideFiles");
};

/**
 * appendix open event
 */
const appendixOpen = () => {
  filesType.dingDishAccessory = props.accessory.dingDishAccessory;
  filesType.ossAccessory = props.accessory.ossAccessory;
};

/**
 * preview file event
 * @param {Object} item
 */
const previewFile = async (item) => {
  await queryDDSpaceId();
  await ddPermission("preview", item);
};
const previewOss = (item) => {
  dd.biz.util.previewImage({
    urls: ["https:" + item.originalUrl], //图片地址列表
    current: "https:" + item.originalUrl, //当前显示的图片链接，建议使用png、jpg格式图片
    onSuccess: function (result) {
      /**/
    },
    onFail: function (err) {
      console.log(err);
    },
  });
};

/**
 * query corp space id
 * @param {*} spaceId
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
    if (type === "preview") {
      previewDDFile(item);
    }
  } else {
    return;
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
    onSuccess: function (res) {},
    onFail: function (err) {
      console.log(err);
    },
  });
};

/**
 * handle download file event
 */
const downloadFile = (item) => {
  let originalUrl = item.originalUrl;
  let fileName = item.fileName;
  if (dd.env.platform != "notInDingTalk") {
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
</script>

<style lang="less">
@import "./fileList.less";
</style>