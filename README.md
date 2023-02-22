<p align="center">
  <a href="https://devui.design/" target="_blank" rel="noopener noreferrer">
    <img alt="D-design Logo" src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c035bf2d77d426da46d4006eec70514~tplv-k3u1fbpfcp-watermark.image" width="180" style="max-width:100%;">
  </a>
</p>

<h1 align="center">Vue D-design</h1>

<p align="center">一个基于 antd的 Vue3 组件库。</p>

## 官网
http://d-design.mawenqing.net/

### 如何使用

进入你的项目文件夹，使用 NPM 安装`d-design`

```shell
npm i d-design
```

### 3. 引入插件和样式

在`src/main.ts`文件中写入以下内容

```ts
import DDesign from 'd-design';

createApp(App).use(DDesign).mount('#app');
```

### 4. 使用

在`src/App.vue`文件的`<template>`中增加以下内容

```vue
<template>
  <!-- 使用 Button 组件 -->
  <da-button>确定</da-button>
</template>
```


## 组件范式
3.1 各组件目录规范

统一目录
都放在packages

统一结构
```js
├── components // 组件目录
├── style  // 样式
├── index.ts // 导出的文件
```

## 组件库本地开发
### 组件本地开发
#### 1、packages下按目录规范创建你的组件

#### 2、组件库项目link到全局
```js
npm link
```
#### 3、其他任意项目 把d-design link到本项目node_modules
```js
npm link d-design
```
#### 4、引入测试
```js
import { ChooseUser } from 'd-design';
```
