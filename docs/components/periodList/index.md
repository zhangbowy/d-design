# PeriodList 周期

选择周期组件

:::demo

```js
<template>
	<div class="period-demo-1">
		<PeriodList :all="false" @updatePeriodInfo="queryOKRByUserId"> </PeriodList>
	</div>
</template>
<script setup>
const queryOKRByUserId = (info) => {
	console.log(info.curPeriodId);
};
</script>
<style>

</style>
```

### PeriodList 参数

| 参数名      | 类型      | 默认值     | 描述                                                                   |
| :---------- | :-------- | :--------- | :--------------------------------------------------------------------- |
| placement   | `string`  | bottom-end | 可选,浮层出现的位置                                                    |
| curPeriodId | `string`  | ''         | 可选 这里主要做初始值使用                                              |
| all         | `boolean` | true       | 可选 我的 OKR/对齐的 O 不显示全部周期                                  |
| align       | `boolean` | false      | 可选，是否对齐 对齐的 O 需要特殊处理，下边的要和上边的对齐             |
| initId      | `string`  | ''         | 可选，对齐的 O 周期初始 ID, 根据初始 ID 设置哪些可以周期可以点击 title |
| immediate   | `boolean` | false      | 可选， 这个属性的目的是之前我的 OKR 中进来直接去调用了组件的 init 方法 |
| renderAll   | `boolean` | false      | 可选，是否渲染全部周期类型                                             |

### PeriodList 事件

| 事件名称         | 描述         | 回调参数       |
| :--------------- | :----------- | -------------- |
| updatePeriodInfo | 更新周期回调 | function(info) |
