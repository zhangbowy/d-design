# LookRelation 查看关联

查看关联的 okr、项目、任务

:::demo

```vue
<template>
	<div class="look-relation-demo-1">
		<a-button @click="handelOpen">打开弹窗</a-button>
		<LookRelation
			:zIndex="3000"
			v-model:visible="visible"
			:tabs="['OKR', 'PROJECT', 'TASK']" />
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

### LookRelation 参数

| 参数名          | 类型      | 默认值     | 描述                                                                                                                                                                                              |     |
| :-------------- | :-------- | :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-- |
| v-model:visible | `boolean` | false      | 必传，用于控制弹窗的显示                                                                                                                                                                          |     |
| tabs            | `array`   | []         | 必传，用来要展示的 tab(OKR、TASK、PROJECT)                                                                                                                                                        |
| info            | `object`  | {}         | 必传，具体信息需要传递当前 id：任务 id 或 okrId 或项目 id，type：类型，例如主任务：TASK_MAIN，sourceType：源类型'TASK' 'PROJECT' 'OKR'，indexId：kr 索引，avatar：头像，name：名称，content：内容 |
| trait           | `string`  | 'OKR'      | 可选，特点口                                                                                                                                                                                      |
| isSureRelation  | `string`  | '添加关联' | 可选，是否可以关联                                                                                                                                                                                |     |
| isSureRelation  | `boolean` | true       | 可选，页面是否可以操作按钮片                                                                                                                                                                      |     |
| zIndex          | `number`  | 1000       | 可选，线上当前侧边栏的层级                                                                                                                                                                        |
| width           | `number`  | 780        | 可选，当前侧边栏的宽度                                                                                                                                                                            |

                                                                   |

### LookRelation 事件

| 事件名称           | 描述     | 回调参数            |
| :----------------- | :------- | ------------------- |
| lookDetailCallback | 查看详情 | function(item,type) |
| refreshList        | 刷新列表 | function()          |
