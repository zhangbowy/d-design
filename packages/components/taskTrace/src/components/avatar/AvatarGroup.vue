<template>
    <div class="avatar-group">
        <div
            v-for="item in userList"
            :key="item?.userId"
            :ref="(el) => avatarRef.push(el)"
            class="group-avatar-box"
            :class="{ 'avatar-bgc': !item?.avatar }"
        >
            <img v-if="item?.avatar" :src="item?.avatar" alt="" />
            <span v-else>{{ item?.name?.slice(0, 1) }}</span>
        </div>
        <iconpark-icon v-if="userData?.length > 4" name="touxiangbeifen5" class="avatar-more"></iconpark-icon>
        <span class="group-name">{{returnName()}}</span>
        <span class="name-length" v-if="userData?.length > 2">等{{userData?.length}}人</span>
    </div>
</template>

<script setup>
import { nextTick, ref, watchEffect } from "vue";

const props = defineProps({
    userData: Array,
});

const userList = ref([]); //save user group
const avatarRef = ref([]); //save avatar list ref

watchEffect(() => {
    avatarRef.value = [];
    if (Array.isArray(props.userData)) {
        if (props.userData.length > 4) {
            let arr = JSON.parse(JSON.stringify(props.userData));
            userList.value = arr.splice(0, 4);
        } else {
            userList.value = props.userData;
        }
    }
    nextTick(() => {
      avatarRef.value.forEach((el,index) => {
        if(el && el.style) {
            el.style.zIndex = 10 - index;
        }
      })
    })
});

/**
 * return current subtask name list
 */
const returnName = () => {
  let arr = [];
  let nameStr = "";
  props.userData.forEach((el) => {
    arr.push(el.name);
  });
  if (arr.length <= 2) {
    nameStr = arr.join("、");
  } else {
    nameStr = arr.splice(0, 2).join("、");
  }
  return nameStr;
};
</script>

<style lang="less">
@import "./avatarGroup.less";
</style>