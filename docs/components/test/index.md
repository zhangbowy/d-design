# Avatar 头像

显示用户头像的组件。

#### 何时使用

当需要显示用户头像时。

### 头像显示的基本规则

头像组件传入'name'属性时，会根据一定的规则显示头像的字段，具体规则参见 API。

:::demo

```vue
<template>
  <div class="avatar-demo-1">
    <d-avatar style="text-align: right" gender="Female" name="组件头像"></d-avatar>
    <d-avatar name="MyAvatar"></d-avatar>
    <d-avatar name="Avatar1 Avatar2"></d-avatar>
    <d-avatar name="1Avatar"></d-avatar>
  </div>
</template>

<style>
.avatar-demo-1 .devui-avatar {
  margin-right: 10px;
}
</style>
```

:::

### 头像的基础配置

头像组件可设置宽度，高度，是否为圆形头像，同时可自定义头像的显示字段，传入自定义图片等。

:::demo

```vue
<template>
  <div class="avatar-demo-2">
    <d-avatar name="Avatar" :width="28" :height="28"></d-avatar>
    <d-avatar customText="DevUI" :width="80" :height="80" :isRound="false"></d-avatar>
    <d-avatar imgSrc="/../../assets/logo.svg" :width="100" :height="100" :isRound="false"></d-avatar>
  </div>
</template>

<style>
.avatar-demo-2 {
  display: flex;
  align-items: center;
}
.avatar-demo-2 .devui-avatar {
  margin-right: 10px;
}
</style>
```

