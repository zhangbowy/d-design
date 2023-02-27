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
	<!-- <CreateTask trait="OKR" :visible="true" :title="'创建任务'" /> -->
	<!-- <TaskDetail
		:visible="visible"
		trait="OKR"
		:curUser="{userId: 0}"
		:taskDetail="{role: ''}" /> -->
	<!-- <LookRelation v-model:visible="visible" :tabs="['OKR', 'PROJECT', 'TASK']" /> -->
	<ul>
		<li v-for="item in mock" :key="item" @click="handelRelation(item)">
			{{ item + '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈' }}
		</li>
	</ul>
	<Relation
		v-model:visible="visible"
		:isDirectAdd="false"
		:info="info"
		curPeriodId="20230304"
		:tabs="['OKR', 'PROJECT', 'TASK']" />
	<a-button type="primary" @click="visible = !visible">测试</a-button>
</template>

<script setup lang="ts">
// import ChooseUser from "./../packages/chooseuserBak"; // 新增
import {reactive, ref} from 'vue';
// import {Avatar, Cycle} from './../dist/pu-ui.es.js'; // 新增
// import Sources from './components/sources.vue'; // 新增
import CreateTask from '@/components/createTask/src/components/index/AddTask.vue';
// ChooseUser({})
const visible = ref(false);
const info = reactive({
	id: 0,
	relevanceType: 'KR',
	relevanceCategory: 'OKR',
});
const mock = [13, 14, 15, 16, 17];
const handelRelation = (item) => {
	visible.value = true;
	info.id = item;
};
</script>

<style scoped>
#app {
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
}
</style>
