<template>
	<div class="date-period">
		<a-popover
			:visibleChange="toggleArrow"
			popper-class="period-popoer"
			v-model:visible="visible"
			:show-arrow="true"
			:offset="6"
			:width="512"
			trigger="click">
			<template #content>
				<div class="period-list-wrapper">
					<div class="period-year-select">
						<span
							class="prev iconfont qzz_icon_zuoyoujiantou1"
							:class="isPrevDisabled"
							@click="toggleYear('prev')"></span>
						<span class="cur-year">{{ curYear }}</span>
						<span
							class="next iconfont qzz_icon_line_right"
							:class="isNextDisabled"
							@click="toggleYear('next')"></span>
					</div>
					<!-- 周期选择项 -->
					<ul class="period-list">
						<li v-for="(type, index) in renderPeriod" :key="index">
							<span
								:class="{
									active: formatCurPeriodId(item.value),
									disabled: align && !disabledPeriod?.includes(item.value),
								}"
								v-for="item in type"
								:key="item.value"
								@click="handleSelectPeriod(item)"
								>{{ item.label }}</span
							>
						</li>
					</ul>
				</div>
			</template>
			<div class="period-cont">
				<span class="period-name">{{ curPeriodText }}</span>
				<down-outlined v-if="!isIcon" />
				<slot v-else name="rightIcon"></slot>
			</div>
		</a-popover>
	</div>
</template>
  <script>
import {ref} from 'vue';
import userPeriod from '@/utils/usePeriod.js';
import {DownOutlined} from '@ant-design/icons-vue';

const {periodList, renderPeriod, PERIOD_TEXT, aliginPeriod, periodType} =
	userPeriod();
let timer = null;
export default {
	name: 'dateperiod',
	/***
	 * 周期列表一共分4类
	 * 1. 我的OKR列表用到的周期，必传参数： :all="false" immediate
	 * 2. 编辑O的时候，对齐的O选择周期  必传参数：  align initId
	 * 3. 其他查询接口需要周期
	 * 4. OKR导出，显示全部周期类型
	 * @params all 用来判断是否显示全部周期
	 * @params immediate 是否立即初始化  在我的OKR列表中使用(如果给我的OKR列表设置初始值，改动太大，所以组件内容去做了初始化)
	 * @params align 是否是对齐的O  对齐的O 有不可点击项
	 * @params initId 对齐的O的初始周期ID 这个id的对应上级周期才可以点击，其他不可以点击
	 * @params curPeriodId 周期ID 这里主要做初始值使用
	 * ********/

	props: {
		placement: {
			type: String,
			default: 'bottom-end',
		},
		curPeriodId: {
			type: String,
			default: '',
		},
		all: {
			type: Boolean,
			default: true, // 是否显示全部周期，默认显示 我的OKR/对齐的O 不显示全部周期
		},
		align: {
			// 是否对齐  对齐的O需要特殊处理，下边的要和上边的对齐
			type: Boolean,
			default: false,
		},
		/***
		 * 对齐的O周期初始ID, 根据初始ID设置哪些可以周期可以点击
		 * *******/
		initId: {
			type: String,
			default: '',
		},
		immediate: {
			// 这个属性的目的是之前我的OKR中进来直接去调用了组件的init方法，
			// init方法之后获取id又进行了一些列操作，改动太大
			type: Boolean,
			default: false,
		},
		renderAll: {
			// 是否渲染全部周期类型
			type: Boolean,
			default: false,
		},
	},
	data() {
		// 设置年默认值
		const curYear = new Date().getFullYear();
		return {
			yearList: [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
			periodList,
			curYear,
			currentPeriodId: '',
			visible: false,
			arrow: false,
			renderPeriod: [],
		};
	},
	mounted() {
		timer = setTimeout(() => {
			this.renderPeriod = renderPeriod(this.all, this.renderAll);
			this.$nextTick(() => {
				if (this.immediate) {
					this.initPeriod();
				} else {
					if (this.all) {
						this.currentPeriodId = this.curPeriodId || this.curYear + '0000';
					} else {
						this.currentPeriodId = this.curPeriodId || this.curYear + '0101';
					}
				}
			});
		}, 500);
	},
	beforeUnmount() {
		timer && clearTimeout(timer);
	},
	computed: {
		isIcon() {
			return this.$slots.rightIcon;
		},
		/****
		 * Function: 处理周期id的比对
		 * ***/
		// formatCurPeriodId() {
		//     let period = this.currentPeriodId.substr(4, 4) || '0000';
		//     return period;
		// },
		/*****
		 * Function: 对齐的时候可以点击的周期
		 * *****/
		disabledPeriod() {
			let result = [];
			if (this.align) {
				result = aliginPeriod(this.initId);
			} else {
				result = [];
			}
			return result;
		},
		curPeriodText() {
			// let year = this.currentPeriodId.substr(0, 4);
			// let period = this.currentPeriodId.substr(4, 4);
			// let month = "";
			// this.periodList.forEach(function (i) {
			//     if (i.periodId == period) {
			//     i.isCurPeriod = true;
			//     month = i.text;
			//     }
			// });
			// return `${year}` + "年 " + `${month}`;
			return PERIOD_TEXT(this.currentPeriodId);
		},
		isPrevDisabled() {
			const index = this.yearList.findIndex((item) => item == this.curYear);
			return index == 0 ? 'disabled' : '';
		},
		isNextDisabled() {
			const index = this.yearList.findIndex((item) => item == this.curYear);
			return index == 8 ? 'disabled' : '';
		},
	},
	methods: {
		/***
		 * Function: 处理周期active
		 * return true/false
		 * ******/
		formatCurPeriodId(value) {
			const year = this.currentPeriodId.substring(0, 4);
			const id = this.currentPeriodId.substring(4, 8);
			const result = id == value && this.curYear == year;
			return result;
		},
		/*
		 * 切换箭头
		 * */
		toggleArrow(visible) {
			if (visible) {
				this.arrow = true;
			} else {
				this.arrow = false;
				this.curYear = this.currentPeriodId.substring(0, 4);
			}
		},
		/*
		 * Function: 周期初始化
		 * 针对我的OKR的初始化周期
		 * 1.已有缓存，判断缓存的周期格式是否符合当前周期格式 不符合则初始化为当前周期格式的最大值(当前所处周期)
		 * 2.没有缓存，初始化为当前周期格式的最大值(当前所处周期)
		 * */
		initPeriod() {
			const {value: period, matching} = this.initPeriodValue();
			// 匹配使用缓存值
			if (matching) {
				this.currentPeriodId = localStorage.getItem('QZZ_CURPERIOD');
			} else {
				// 不匹配使用初始值
				this.currentPeriodId = period;
				localStorage.setItem('QZZ_CURPERIOD', this.currentPeriodId);
			}
			this.curYear = this.currentPeriodId?.substr(0, 4);
			//存储操作
			this.nextDo();
		},
		/****
		 * Function: 计算当前月份对齐的上级周期的对应值
		 * month: 月份  num: 一个周期对应几个月
		 * return 上级周期的下标值
		 * 例：现在是6月份  对应上级周期为半年的时候为上半年，返回值为01
		 *  对应上级周期为双月的时候上级周期对应值为5-6月份  返回值为03
		 * ****/
		calcPeriodAlign(month, num) {
			const remainder = month % num;
			const floorValue = Math.floor(month / num);
			const result = remainder > 0 ? floorValue + 1 : floorValue;
			return result;
		},
		/*****
		 * Function: 初始化周期的值
		 * ****/
		initPeriodValue() {
			const QZZ_CORP_CONFIG = JSON.parse(
				localStorage.getItem('QZZ_CORP_CONFIG') || '{}'
			);
			const period = localStorage.getItem('QZZ_CURPERIOD');
			const configPeriod = QZZ_CORP_CONFIG.periodCommand?.periodTypes;
			let matching = true;
			// 判断当前周期配置与缓存周期类型是否一直
			if (period) {
				const cacheType = periodType(period);
				if (!configPeriod?.includes(cacheType)) {
					matching = false;
				}
			} else {
				// ls不存在
				matching = false;
			}
			// 处理初始值 当前最大周期格式所处的周期
			let value = '';
			const maxPeriod = configPeriod[0];
			const time = new Date();
			const year = time.getFullYear();
			const month = time.getMonth() + 1;
			switch (maxPeriod) {
				case '01': // 年
					value = '0101';
					break;
				case '04': // 半年
					{
						const halfyear = this.calcPeriodAlign(month, 6);
						value = `04${halfyear > 10 ? halfyear : '0' + halfyear}`;
					}
					break;
				case '02': // 季度
					{
						const season = this.calcPeriodAlign(month, 3);
						value = `02${season > 10 ? season : '0' + season}`;
					}
					break;
				case '05': // 双月
					{
						const dobuleM = this.calcPeriodAlign(month, 2);
						value = `05${dobuleM > 10 ? dobuleM : '0' + dobuleM}`;
					}
					break;
				case '03': // 月
					value = `03${month > 9 ? month : '0' + month}`;
					break;
			}
			return {
				matching,
				value: year + value,
			};
		},
		/*
		 * 切换年
		 * */
		toggleYear(type) {
			//取消选中
			// let i = this.periodList.find((item) => item.isCurPeriod);
			// if (i) {
			//     i.isCurPeriod = false;
			// }
			//如果到头了就不在继续切换
			let index = this.yearList.findIndex((item) => item == this.curYear);
			if (type == 'prev') {
				if (index == 0) {
					return;
				}
				this.curYear = this.yearList[index - 1];
			} else if (type == 'next') {
				if (index == this.yearList.length - 1) {
					return;
				}
				this.curYear = this.yearList[index + 1];
			}
		},
		/*
		 * 后续操作
		 * */
		nextDo() {
			if (this.immediate) {
				//存储VUEX
				this.$store.dispatch('setPeriodInfo', {
					curPeriodId: this.currentPeriodId,
					curYear: this.curYear,
					curPeriodText: this.curPeriodText,
				});
			}
			//初始化OKR列表
			this.$emit('updatePeriodInfo', {
				curPeriodId: this.currentPeriodId,
				curYear: this.curYear,
				curPeriodText: this.curPeriodText,
			});
		},
		/****
		 * Function: 周期选择
		 * *****/
		handleSelectPeriod(row) {
			// 是否可以点击
			if (this.align && !this.disabledPeriod?.includes(row.value)) {
				return false;
			}
			// 组装id
			this.currentPeriodId = this.curYear + row.value;
			//选中之后弹层消失
			this.visible = false;
			// 仅在我的OKR页面中 存储在localStorage
			this.immediate &&
				localStorage.setItem('QZZ_CURPERIOD', this.currentPeriodId);
			//存储操作
			this.nextDo();
			// 我的指派选择周期之后刷新
			// this.immediate && location.reload();
		},
	},
	emits: ['updatePeriodInfo'],
	components: {
		DownOutlined,
	},
};
</script>
  <!-- 新的周期样式 -->
  <style scoped lang="less">
@import './index.less';
</style>
