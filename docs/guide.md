# 快速开始

引导您如何在项目中使用`da-ui`

### Vue版本

当前支持的 Vue 版本`^3.0.0`

### 1. 创建一个项目

推荐使用`@vite/cli`创建你的项目

```shell
# npm 6.x
npm create vite my-vue-app --template vue-ts

# npm 7+
npm create vite my-vue-app -- --template vue-ts
```

### 2. 安装

进入你的项目文件夹，使用 NPM 安装`da-ui`和配套的图标库

```shell
npm i d-design
```

### 3. 引入插件和样式

在`src/main.ts`文件中写入以下内容

```ts
import DDesign from 'd-design';

createApp(App).use(DevUI).mount('#app');
```

### 4. 使用

在`src/App.vue`文件的`<template>`中增加以下内容

```vue
<template>
  <!-- 使用 Button 组件 -->
  <da-button>确定</da-button>
</template>
```

### 5. 启动开发调试

```shell
npm run dev
```

### 6 按需引入

参考：[按需引入]()

### 7 主题定制

参考：[主题定制]()
