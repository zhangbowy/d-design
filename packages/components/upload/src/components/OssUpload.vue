<template>
  <a-upload :customRequest="handleOssUpload" :showUploadList="false">
    <slot></slot>
  </a-upload>
</template>

<script setup>
import { ref } from "vue";
import { GET_STS, GET_FILES_PATH } from "../api";
import { getQueryVariable } from "@/utils/utils";
import ossClient from "@/utils/oss";

const props = defineProps({
  bizId: [Number, String],
  corpId: {
    type: String,
    default: () => {
      return getQueryVariable("corpId")
    },
    required: false
  },
  appId: {
    type: String,
    default: () => {
      return getQueryVariable("appId")
    },
    required: false
  },
  bizType: {
    type: String,
    default: 'okr_score',
    required: false
  }
});

const emit = defineEmits(["startUpload", "endUpload"]);

// oss config
const OSSConfig = ref({
  accessKeyId: "", // 你创建的Bucket时获取的
  accessKeySecret: "", // 你创建的Bucket时获取的
  bucket: "", // 你创建的Bucket名称
  region: "oss-cn-shanghai", // 你所购买oss服务的区域，默认oss-cn-hangzhou
  path: "", // 文件路径
  fileName: "", // 服务端根据UUID生成唯一的文件名
  stsToken: "",
  refreshSTSTokenInterval: 300000,
  refreshSTSToken: async () => {},
});
const fileList = ref([]); //save upload list
const updatedFileData = ref([]); //save current upload files

/**
 * handle upload file to oss
 * @param {Object} file
 */
const handleOssUpload = async (file) => {
  emit("startUpload");
  fileList.value.push(file.file);
  const params = {
    bizId: props.bizId,
    bizType: props.bizType
  };
  const { code, data } = await GET_STS(params);
  if (code === 1) {
    const { accessKeyId, accessKeySecret, securityToken } = data;
    OSSConfig.value.accessKeyId = accessKeyId;
    OSSConfig.value.accessKeySecret = accessKeySecret;
    OSSConfig.value.stsToken = securityToken;
    getFilesPath();
  }
};

/**
 * get files path
 */
const getFilesPath = async () => {
  const parmas = formatFilePathParams();
  const { code, data } = await GET_FILES_PATH(parmas);
  if (code === 1) {
    uploadFile(data);
  }
};

/**
 * handle files path params
 */
const formatFilePathParams = () => {
  const result = [];
  fileList.value.forEach((file) => {
    const type = formatFileType(file.type);
    result.push({
      type,
      appId: props.appId,
      corpId: props.corpId,
      bizId: props.bizId,
      bizType: props.bizType,
      fileName: file.name,
    });
  });
  return result;
};

/**
 * return file type
 * @param {String} fileType
 * @return {String}
 */
const formatFileType = (fileType) => {
  let type = "";
  if (fileType.indexOf("image") > -1) {
    type = 1;
  } else if (fileType.indexOf("video") > -1) {
    type = 2;
  } else if (fileType.indexOf("audio") > -1) {
    type = 3;
  } else {
    type = 4;
  }
  return type;
};

/**
 * upload file event
 * @param {Array} pathData
 */
const uploadFile = async (pathData) => {
  try {
    OSSConfig.value.bucket = pathData[0].bucket;
    pathData.forEach(async (fileInfo, index) => {
      const fileName = fileInfo.path;
      const file = fileList.value[index];
      const { res, url } = await ossClient(OSSConfig.value).put(
        fileName,
        file,
        {}
      );
      if (res && res.status == 200) {
        const type = formatFileType(file.type);
        updatedFileData.value.push({
          type: type,
          cname: fileInfo.cname,
          fileName: file.name,
          ossMaterialId: fileInfo.id,
          path: fileInfo.path,
          size: file.size,
          originalUrl: url,
        });
        emit("endUpload", updatedFileData.value);
        updatedFileData.value= [];
      }
    });
    fileList.value = [];
  } catch (error) {
    console.log(error);
  }
};
</script>

<style lang="less">
</style>