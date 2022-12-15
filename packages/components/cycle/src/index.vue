<template>
  <a-popover
		trigger="click"
        :visible="visible"
		arrowPointAtCenter
		overlayClassName="period-overlay">
		<template #default>
			<div class="period-card" @click="handleOpenPopover">
				<span>{{ periodText(curSelCycle) }}</span>
				<down-outlined />
			</div>
		</template>
		<template #content>
            <ul class="period-pull" >
                <li v-for="item of periodNormalList" :key="item.value" @click="handelPeriodClick(item)" >
                    <span>{{item.label}}</span>
                    <check-outlined class="outlined" v-if="curSelCycle==item.value" />
                </li>
            </ul>
		</template>
	</a-popover>
</template>

<script setup lang='ts'>
import {DownOutlined,CheckOutlined} from '@ant-design/icons-vue'
import { IResult  } from './type'
import {onMounted, ref} from 'vue'
import {
	createPeriodYearList,
	initPeriodValue,
	createPeriodNormalList,
	periodText,
} from '@/hooks/usePeriod';
const props = defineProps({
    currentCycle:{
        type:String,
        default:''
    },
})
defineOptions({
	name: 'Cycle',
});

const emit = defineEmits(['change'])
const visible = ref(false) // 下拉状态
const curSelCycle = ref(props.currentCycle ||  initPeriodValue()) // 当前显示的周期id
const yearList = createPeriodYearList();
const periodNormalList = createPeriodNormalList();
// 控制下拉是否显示
const handleOpenPopover = () => {
	visible.value = true;
};
// 周期点击
const handelPeriodClick = (item:IResult) =>{
    curSelCycle.value = item.value
    visible.value = false;
    emit('change',item)
}
</script>
<style scoped lang='less'>
@import './index.less';
</style>

<style  lang='less'>
.period-overlay {
    .ant-popover-inner-content {
        padding: 0;

    }

}
</style>
