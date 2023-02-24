# Relation 关联

关联项目的 okr、项目、任务

:::demo

```js
<template>
	<div class="relation-demo-1">
		<a-button @click="handelOpen">打开弹窗</a-button>
		<Relation
			v-model:visible="visible"
			:tabs="['OKR', 'PROJECT', 'TASK']"
			:info="{
				id: 0,
				relevanceType: '',
				relevanceCategory: ''
			}" />
	</div>
</template>

<script setup>
import {ref} from 'vue';
const visible = ref(false);
const handelOpen = () => {
	visible.value = true;
};
</script>

<style></style>
```

### Relation 参数

| 参数名          | 类型      | 默认值                                                             | 描述                                                                                                                                  |
| :-------------- | :-------- | :----------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| v-model:visible | `boolean` | false                                                              | 必传，用于控制弹窗的显示                                                                                                              |
| tabs            | `array`   | []                                                                 | 必传，用来要展示的 tab(OKR、TASK、PROJECT)                                                                                            |
| info            | `object`  | {}                                                                 | 必传，具体信息需要传递当前 id（任务 id 或 okrId 或项目 id）、relevanceType（类型）、relevanceCategory（源类型'TASK' 'PROJECT' 'OKR'） |
| isDirectAdd     | `boolean` | true                                                               | 可选，是否调用新增接口                                                                                                                |
| defaultChecked  | `object`  | {okrDefaultCheck: [],taskDefaultCheck: [],projectDefaultCheck: []} | 可选，默认选择                                                                                                                        |
| title           | `string`  | '添加关联'                                                         | 可选，用来显示 title                                                                                                                  |
| showTab         | `boolean` | true                                                               | 可选，是否显示 tab 卡片                                                                                                               |
| zIndex          | `number`  | 1000                                                               | 可选，线上当前侧边栏的层级                                                                                                            |

### Relation 事件

| 事件名称           | 描述         | 回调参数            |
| :----------------- | :----------- | ------------------- |
| lookDetailCallback | 查看详情     | function(item,type) |
| refreshList        | 刷新列表     | function()          |
| successCallback    | 获取关联参数 | function(params)    |
| close              | 关闭时的回调 | function()          |
