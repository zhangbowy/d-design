<template>
    <div class="app">
        <Cycle />
        <Avatar name="张博" :size="200" a1vatar="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/031893abb64b40d6b4e14d0aad8e7760~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp"></Avatar>
    </div>
</template>

<script setup lang="ts">
// import ChooseUser from "./../packages/chooseuserBak"; // 新增
import {Avatar} from "./../dist/pu-ui.es.js"; // 新增
// ChooseUser({})
</script>

<style scoped>
    .app{
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
    }
</style>
