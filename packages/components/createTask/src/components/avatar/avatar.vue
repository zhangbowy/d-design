<template>
	<div v-if="!Array.isArray(userData)" class="avatar-main">
		<div class="avatar-box" :class="{'avatar-bgc': !userData?.avatar}">
			<img v-if="userData?.avatar" :src="userData?.avatar" alt="" />
			<span v-else>{{ userData?.name?.slice(0, 1) }}</span>
		</div>
		<span class="avatar-user-name">{{ userData?.name }}</span>
	</div>
	<div v-else class="avatar-group">
		<div
			v-if="userData.length == 1"
			class="one-avatar"
			:class="{'avatar-bgc': !userData[0]?.avatar}">
			<div>
				<img v-if="userData[0]?.avatar" :src="userData[0].avatar" alt="" />
				<span v-else>{{ userData[0]?.name?.slice(0, 1) }}</span>
			</div>
		</div>
		<div v-if="userData.length <= 4 && userData.length > 1" class="more-avatar">
			<div
				v-for="item in userData"
				:key="item.userId"
				class="avatar-block"
				:class="{'avatar-bgc': !item?.avatar}">
				<img v-if="item?.avatar" :src="item.avatar" alt="" />
				<span v-else>{{ item?.name?.slice(0, 1) }}</span>
			</div>
		</div>
		<div v-if="userData.length > 4" class="more-avatar">
			<div
				v-for="item in userData.slice(0, 9)"
				:key="item.userId"
				class="avatar-nine-block"
				:class="{'avatar-bgc': !item?.avatar}">
				<img v-if="item?.avatar" :src="item.avatar" alt="" />
				<span v-else>{{ item?.name?.slice(0, 1) }}</span>
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	userData: [Object, Array],
});
</script>

<style lang="less" >
@import './avatar.less';
</style>
