# RenewTask 更新任务状态

更新任务状态组件

#### 何时使用

当需要更新任务状态时

### RenewTask 参数

| 参数名称 |  类型   |  默认值  | 是否可为空 |              引入含义              | 回调提供参数 |
| :------: | :-----: | :------: | :--------: | :--------------------------------: | :----------: |
| visible  | Boolean |  false   |   false    |          control visible           |      /       |
| toStatus | String  |    /     |   false    | the state that needs to be updated |      /       |
|  dragEl  | Object  |    /     |   false    |       get current task data        |      /       |
|  zIndex  | Number  |   1000   |    true    |     control component z-index      |      /       |
|  title   | String  | 更新说明 |    true    |          component title           |      /       |
  
### 组件传出参数简介

|  参数名称  | 类型  | 默认值 | 是否可为空 |           含义           |    回调提供参数     |
| :--------: | :---: | :----: | :--------: | :----------------------: | :-----------------: |
| closeRenew |  Fun  |   /    |   false    | close component callback | status(close/renew) |

### 示例

```js
   <RenewTask :visible="true" toStatus="DONE" :dragEl="dragEl" :zIndex="1000" @closeRenew="closeRenew" />

   const closeRenew = (status) => {
     //to do...
   };
```   
