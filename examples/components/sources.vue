<template>
    <div class="app">

        <h2></h2>


        <br>


         <span @click="onClickBtn">按钮</span>

    </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";

// import ChooseUser from "./../packages/chooseuserBak"; // 新增
// ChooseUser({})


function onClickBtn(event)  {
    // event.prevent
}

let a = 1

function testFn2() {
    a = 3
    console.log('testFn2 line1')
    console.log('testFn2 line2')
    console.log('testFn2 line3')
}

function testFn1() {
    a = 2
    console.log('testFn1 line1')
    console.log('testFn1 line2')
    testFn2()
    console.log('testFn1 line3')
}


onMounted(() => {
    testFn1()
})
</script>

<style scoped>
</style>
