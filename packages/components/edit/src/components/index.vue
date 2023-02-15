<template>
  <Editor v-model="myValue" :init="init" :id="tinymceId"></Editor>
</template>

<script setup>
import Editor from "@tinymce/tinymce-vue";
import tinymce from "tinymce/tinymce";
import "tinymce/skins/content/default/content.min.css";
import "tinymce/themes/silver";
import "tinymce/themes/silver/theme";
import "tinymce/icons/default"; //引入编辑器图标icon，不引入则不显示对应图标
import "tinymce/models/dom"; // 这里是个坑 一定要引入
import "tinymce/icons/default/icons";
// import "tinymce/plugins/wordcount" // 字数统计插件
import "tinymce/plugins/autolink"; // 链接
// import "tinymce/plugins/paste";
import { ref, reactive, onMounted, watch } from "vue";
import { QUERY_TASK_USER } from "../api";

const props = defineProps({
  value: {
    type: String,
    default: () => {
      return "";
    },
  },
  inline: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "请输入内容",
  },
  files: {
    type: Array,
    default() {
      return [];
    },
  },
  user: {
    type: Array,
    default() {
      return [];
    },
  },
  taskId: {
    type: [Number, String],
  },
  commentValue: {
    type: String,
  },
});

const emit = defineEmits(["updateValue", "updateMarkUsers", "updateContent"]);

const myValue = ref(props.value);
const tinymceId = ref(
  "vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + "")
);
const editorInstance = ref(null); //save editor instance

const init = reactive({
  selector: "#" + tinymceId.value, //富文本编辑器的id,
  // language_url: "/tinymce/langs/zh-Hans.js", // 语言包的路径，具体路径看自己的项目，文档后面附上中文js文件
  language_url:
    "https://daily-static-file.oss-cn-shanghai.aliyuncs.com/okr-assets/tinymce/langs/zh-Hans.js",
  language: "zh_CN", //语言
  skin_url:
    "https://daily-static-file.oss-cn-shanghai.aliyuncs.com/okr-assets/tinymce/skins/ui/oxide", // skin路径，具体路径看自己的项目
  // min_height:100, //编辑器高度
  height: 100,
  weight: 300,
  branding: false, //是否禁用“Powered by TinyMCE”
  menubar: false, //顶部菜单栏显示
  image_dimensions: false, //去除宽高属性
  statusbar: false, // 隐藏底部状态栏
  content_style:
    "p {margin: 0px; border:0px ; padding: 0px; font-size: 14px;} body {font-size: 14px;}",
  fontsize_formats: "12px", //文字大小
  // paste_convert_word_fake_lists: false, // 插入word文档需要该属性
  toolbar: false,
  paste_webkit_styles: "all",
  paste_merge_formats: true,
  nonbreaking_force_tab: false,
  paste_auto_cleanup_on_paste: false,
  file_picker_types: "file",
  paste_data_images: false, // 是否允许粘贴图片
  placeholder: props.placeholder,
  inline: props.inline, // 内联模式 飞书文档的形式
  plugins: "autolink",
  paste_auto_cleanup_on_paste: true,
  paste_remove_styles: true,
  paste_remove_styles_if_webkit: true,
  paste_strip_class_attributes: true,
  content_css: [
    "https://daily-static-file.oss-cn-shanghai.aliyuncs.com/okr-assets/tinymce/skins/content/default/content.min.css",
    "https://daily-static-file.oss-cn-shanghai.aliyuncs.com/okr-assets/tinymce/index.css",
  ], //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
  paste_postprocess: async function (plugin, args) {
    args.node.childNodes.forEach((el, index) => {
      if (el.data.includes("http")) {
        editorInstance.value.insertContent(
          `<a href="${el.data}">${el.data}</a>`
        );
        el.data = "";
      }
    });
  },
  setup(editor, url) {
    editorInstance.value = editor;
    editor.ui.registry.addAutocompleter("specialchars", {
      ch: "@", // 设置@为触发符
      minChars: 0, // 最小的触发字符
      columns: 1, // 待选区域展示列数
      onAction: remindSelectedHandle,
      fetch: queryUserList, // 待选区域数据，可返回promise
    });

    function remindSelectedHandle(autocompleteApi, rng, value) {
      let userObj = JSON.parse(value); // 反序列化拿到选择的用户对象
      editor.selection.setRng(rng);
      editor.insertContent(
        `<span class="mark-user" style="color:#3073ff" contenteditable="false" data-remind-user-id="${userObj.id}">@${userObj.name}</span>`
      );
      // 插入空格 可以输入之后再次直接@调用
      editor.insertContent("&nbsp;");
      autocompleteApi.hide();
    }
  },
});

onMounted(() => {
  tinymce.init({});
});

watch(
  () => myValue.value,
  () => {
    emit("updateValue", myValue.value);
    getMarkUsers();
    getContent();
  }
);

watch(
  () => props.commentValue,
  () => {
    myValue.value = props.commentValue;
  }
);

function handlePromise(promiseList) {
  return promiseList.map((promise) =>
    promise.then(
      (res) => ({ status: "ok", res }),
      (err) => ({ status: "not ok", err })
    )
  );
}
Promise.allSettled = function (promiseList) {
  return Promise.all(handlePromise(promiseList));
};

const getMarkUsers = () => {
  let iframe = document.getElementsByClassName("tox-edit-area__iframe")[0];
  let doc = iframe.contentWindow.document;
  let users = doc.getElementsByClassName("mark-user");
  let userIds = [];
  let arr = Array.from(users);
  if (arr.length > 0) {
    arr.map((el) => {
      userIds.push(el.getAttribute("data-remind-user-id"));
    });
  }
  emit("updateMarkUsers", userIds);
};

const getContent = () => {
  const content = editorInstance.value.getContent({ format: "text" });
  emit("updateContent", content);
};

/**
 * query can mark user list
 * @param {String} value
 */
const queryUserList = async (value) => {
  try {
    const { data, code } = await QUERY_TASK_USER({
      id: props.taskId,
      keyWord: value,
    });
    if (code === 1) {
      const result = [];
      data.forEach((item) => {
        const value = JSON.stringify({ id: item.userId, name: item.name });
        result.push({ value, text: item.name });
      });
      return Promise.resolve(result);
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>
