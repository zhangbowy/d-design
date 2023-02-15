<template>
	<div class="app">
		<!-- <Cycle /> -->
		<Relation v-model:show="show" :tabs="['PROJECT', 'TASK']" />
	</div>
</template>

<script setup lang="ts">
// import ChooseUser from "./../packages/chooseuserBak"; // 新增

import {ref} from 'vue';

// ChooseUser({})
const show = ref(true);
</script>

<style scoped>
.app {
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
}
</style>
