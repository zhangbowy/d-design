<template>
	<!-- <div class="app"> -->
	<!-- <Sources></Sources> -->
	<!-- <Cycle /> -->
	<!-- <Relation v-model:visible="visible" :tabs="['OKR', 'PROJECT', 'TASK']" /> -->
	<!--        <OssUpload />-->
	<!-- <Avatar
			name="张博"
			:size="48"
			a1vatar="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/031893abb64b40d6b4e14d0aad8e7760~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp"></Avatar> -->
	<!-- </div> -->
	<!-- <CreateTask :visible="true" :title="'创建任务'" /> -->
	<LookRelation
		:zIndex="3000"
		v-model:visible="visible"
		:tabs="['OKR', 'PROJECT', 'TASK']" />
	<a-button type="primary">测试</a-button>
</template>

<script setup lang="ts">
// import ChooseUser from "./../packages/chooseuserBak"; // 新增
import {ref} from 'vue';
// import {Avatar, Cycle} from './../dist/pu-ui.es.js'; // 新增
// import Sources from './components/sources.vue'; // 新增
import CreateTask from '../packages/components/createTask/src/index';
// ChooseUser({})
const visible = ref(true);
</script>

<style scoped>
#app {
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
}
</style>
