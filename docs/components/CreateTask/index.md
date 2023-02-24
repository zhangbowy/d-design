# CreateTask 创建任务

创建任务组件。

#### 何时使用

当需要创建任务时。

### CreateTask 参数

| 参数名称  |  类型   |  默认值  | 是否可为空 |              引入含义               | 回调提供参数 |
| :-------: | :-----: | :------: | :--------: | :---------------------------------: | :----------: |
|  visible  | Boolean |  false   |   false    |           control visible           |      /       |
|  curUser  | Object  |    /     |   false    |        get current user data        |      /       |
|   title   | String  | 创建任务 |    true    |         set component title         |      /       |
|   trait   | String  |   QZP    |    false    | distinguish current running project |      /       |
| projectId | Number  |    0     |    true    |         project must import         |      /       |
|  menuId   | Number  |    0     |    true    |         project must import         |      /       |
|   width   | Number  |   480    |    true    |           component width           |      /       |
  
### 组件传出参数简介

|   参数名称    | 类型  | 默认值 | 是否可为空 |             含义             | 回调提供参数 |
| :-----------: | :---: | :----: | :--------: | :--------------------------: | :----------: |
|  closeDrawer  |  Fun  |   /    |   false    |   close component callback   |      /       |
| successCreate |  Fun  |   /    |   false    | success create task callback |      taskId       |

### 示例

```js
   <CreateTask :visible="true" :curUser="curUser" trait="OKR" :title="'创建任务'" :width="500" @closeDrawer="closeDrawer" @successCreate="successCreate" />

   const closeDrawer = () => {
     //to do...
   };

   const successCreate = (taskId) => {
      //to do...
   }
```   
