# OssUpload 阿里云上传

阿里云上传组件

#### 何时使用

当需要阿里云上传时

### OssUpload 参数

| 参数名称 |       类型       |  默认值   | 是否可为空 | 引入含义  | 回调提供参数 |
| :------: | :--------------: | :-------: | :--------: | :-------: | :----------: |
|  bizId   | [Number, String] |     /     |   false    | unique id |      /       |
|  corpId  |      String      |  corpId   |    true    |  corpId   |      /       |
|  appId   |      String      |  corpId   |    true    |   appId   |      /       |
| bizType  |      String      | okr_score |    true    |     /     |      /       |
  
### 组件传出参数简介

|  参数名称   | 类型  | 默认值 | 是否可为空 |     含义      | 回调提供参数 |
| :---------: | :---: | :----: | :--------: | :-----------: | :----------: |
| startUpload |  Fun  |   /    |   false    | begin upload  |      /       |
|  endUpload  |  Fun  |   /    |   false    | finish upload |    files     |

### 示例  

:::demo

```vue
<template>
  <OssUpload :bizId="0">
    <button>点击上传</button>
  </OssUpload>
</template>

<style lang="less">
button {
  background: #3073ff;
  padding: 4px 9px;
  border-radius: 8px;
  color: #fff;
}
</style>
```

:::


```js 
<OssUpload :bizId="0" @startUpload="startUpload" @endUpload="endUpload">
  <button>点击上传</button>
</OssUpload>
const startUpload = () => {
//todo...
};
const endUpload = (ossArr) => {
	files.push(...ossArr);
	//todo...
};
```
