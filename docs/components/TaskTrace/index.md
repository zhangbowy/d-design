# TaskTrace 任务追踪

任务追踪组件

#### 何时使用

当需要查看任务追踪时

### TaskTrace 参数

| 参数名称 |  类型   | 默认值 | 是否可为空 |              引入含义               | 回调提供参数 |
| :------: | :-----: | :----: | :--------: | :---------------------------------: | :----------: |
| visible  | Boolean | false  |   false    |           control visible           |      /       |
| curUser  | Object  |   /    |   false    |        get current user data        |      /       |
| taskData | Object  |   /    |   false    |        get current task data        |      /       |
|  trait   | String  |  QZP   |   false    | distinguish current running project |      /       |
  
### 组件传出参数简介

| 参数名称 | 类型  | 默认值 | 是否可为空 |           含义           | 回调提供参数 |
| :------: | :---: | :----: | :--------: | :----------------------: | :----------: |
| closeMap |  Fun  |   /    |   false    | close component callback |      /       |

### 示例

```js
   <TaskTrace :visible="true" :curUser="curUser" trait="OKR" :taskData="taskData" @closeMap="closeMap" />

   const closeMap = () => {
     //to do...
   };
```   