# TaskDetail 任务详情

任务详情组件

#### 何时使用

当需要查看任务详情时

### TaskDetail 参数

|  参数名称  |  类型   |  默认值  | 是否可为空 |              引入含义               | 回调提供参数 |
| :--------: | :-----: | :------: | :--------: | :---------------------------------: | :----------: |
|  visible   | Boolean |  false   |   false    |           control visible           |      /       |
|  curUser   | Object  |    /     |   false    |        get current user data        |      /       |
|   title    | String  | 任务详情 |    true    |         set component title         |      /       |
|   trait    | String  |   QZP    |    false    | distinguish current running project |      /       |
| taskDetail | Object  |    /     |   false    |              task data              |      /       |
|   isCut    | Boolean |  false   |    true    |        qzp private variable         |      /       |
|    mask    | Boolean |   true   |    true    |     control drawer mask visible     |      /       |
| showDetail | Boolean |   true   |    true    |     control task trace visible      |      /       |
|   zIndex   | Number  |   1000   |    true    |          component z-index          |      /       |
  
### 组件传出参数简介

|      参数名称       | 类型  | 默认值 | 是否可为空 |              含义              | 回调提供参数 |
| :-----------------: | :---: | :----: | :--------: | :----------------------------: | :----------: |
|     closeDrawer     |  Fun  |   /    |   false    |    close component callback    |      /       |
|    saveCurTaskId    |  Fun  |   /    |    true    |    close component callback    |    taskId    |
|    successChange    |  Fun  |   /    |   false    |  success update task callback  |      /       |
| checkRelationDetail |  Fun  |   /    |    true    | check relation detail callback | item & type  |

### 示例

```js
   <TaskDetail :visible="true" :curUser="curUser" trait="OKR" :title="'任务详情'" :taskDetail="taskDetail" @closeDrawer="closeDrawer" @successChange="successChange" />

   const closeDrawer = () => {
     //to do...
   };

   const successChange = () => {
      //to do...
   }
```   