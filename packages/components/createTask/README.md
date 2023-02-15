# 创建任务组件文档

## 时间周期组件引导

> create-task

### 组件传入参数简介

| 参数名称 |  类型  | 默认值 | 是否可为空 |    引入含义     | 回调提供参数 |
| :------: | :----: | :----: | :--------: | :-------------: | :----------: |
| visible  | String |   /    |   false    | control visible |      /       |
|  title   | String |   /    |   false    |      title      |      /       |


### 组件传出参数简介

|  参数名称   |   类型   | 默认值 | 是否可为空 |      含义       | 回调提供参数 |
| :---------: | :------: | :----: | :--------: | :-------------: | :----------: |
| closeDrawer | Function |   /    |     /      | close component |      /       |


### 示例

```js
   <CreateTask :visible="true" :title="'创建任务'" @closeDrawer="closeDrawer" />

   const closeDrawer = () => {
     //to do...
   }
```     
