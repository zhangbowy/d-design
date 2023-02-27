# 选人组件

## 参数说明

| 参数名称  |  类型   |  默认值  | 是否必需 |              引入含义               | 回调提供参数 |
| :-------: | :-----: | :------: | :--------: | :---------------------------------: | :----------: |
|  visible  | Boolean |  false   |   true    |           弹框显示/隐藏           |      /       |
|  zIndex   | Number  |    1000  |   false    |        弹框层级        |      /       |
|   filterSelf   | Boolean  | false |    false    |         是否过滤当前用户         |      /       |
|   searchAllZone   | Boolean  |   false    |    false    |  是否全空间搜索 |      /       |
| multiSelect | Boolean  |    true     |    false    |        是否多选         |      /       |
|  showCheckbox   | Boolean  |    true    |    false    |       是否显示复选框       |      /       |
|   title   | String  |   请选择人员    |    false    |            弹框title           |      /       |
|   selectedUsers   | Array  |   []    |    false    |已选择的人员，在弹框回显的时候使用   |      /       |


## 事件说明

|  事件名称   |   事件描述  |   回调 |
| :-------: | :-----: | :------: |
| updateUserIds | 确定回调 | function(user): 选择人员之后点击确定触发, user为所选择人员的数组  |
| close | 关闭回调 | function:  弹窗关闭的时候触发  |


## 组件使用

```js
import { ChooseUser }  from 'd-design'

// v-if是为了等使用时才去渲染组件并调用对应接口
<ChooseUser v-if="visible" :visible="visible" :selectedUsers="selectedUsers"  @updateUserIds="handleUpdateUser" @close="handleCloseUser" />

// 成功的回调
const handleUpdateUser = (val) =>{
    // val的数据格式 [{userId: xxxxxxx, name: xxx, avatar: xxxx }]
}

const handleCloseUser = ()=> {
    visible = false
}


```