# DDUpload 钉钉上传

钉钉上传组件

#### 何时使用

当需要钉钉上传时
  
### 组件传出参数简介

|   参数名称    | 类型  | 默认值 | 是否可为空 |     含义      | 回调提供参数 |
| :-----------: | :---: | :----: | :--------: | :-----------: | :----------: |
| ddStartUpload |  Fun  |   /    |   false    | begin upload  |      /       |
|  ddEndUpload  |  Fun  |   /    |   false    | finish upload |    files     |

### 示例  

```js 
<DDUploadVue @ddStartUpload="ddStartUpload" @ddEndUpload="ddEndUpload">
    <div class="upload-btn">
        <span class="btn-text">添加钉盘文件</span>
    </div>
</DDUploadVue>

const ddStartUpload = () => {
    //todo...
};
/**
 * upload dd end callback
 * @param {Array} ddArr
 */
const ddEndUpload = (ddArr) => {
    accessory.dingDishAccessoryList = ddArr;
    //todo...
};
```
