import {getStorage} from './utils.ts';
export default function userPeriod() {
	const periodList = [
		{clsName: 'all', periodId: '0000', text: '全部周期'},
		{clsName: 'year', periodId: '0101', text: '年度'},
		{clsName: 'quarter', periodId: '0201', text: '第一季度'},
		{clsName: 'quarter', periodId: '0202', text: '第二季度'},
		{clsName: 'quarter', periodId: '0203', text: '第三季度'},
		{clsName: 'quarter', periodId: '0204', text: '第四季度'},
		{clsName: 'month', periodId: '0301', text: '1月'},
		{clsName: 'month', periodId: '0304', text: '4月'},
		{clsName: 'month', periodId: '0307', text: '7月'},
		{clsName: 'month', periodId: '0310', text: '10月'},
		{clsName: 'month', periodId: '0302', text: '2月'},
		{clsName: 'month', periodId: '0305', text: '5月'},
		{clsName: 'month', periodId: '0308', text: '8月'},
		{clsName: 'month', periodId: '0311', text: '11月'},
		{clsName: 'month', periodId: '0303', text: '3月'},
		{clsName: 'month', periodId: '0306', text: '6月'},
		{clsName: 'month', periodId: '0309', text: '9月'},
		{clsName: 'month', periodId: '0312', text: '12月'},
	];
	// 定义周期类型
	const ALL_PERIOD = '00'; // 全部周期
	const YEAR_PERIOD = '01'; // 年度
	const HALF_YEAR_PERIOD = '04'; // 半年
	const SEASON_PERIOD = '02'; // 季度
	const DOBULE_MONTH_PERIOD = '05'; // 双月
	const MONTH_PERIOD = '03'; // 月

	const periodListAll = {
		// 全部周期
		[ALL_PERIOD]: [
			{
				value: '0000',
				label: '全部周期',
			},
		],
		// 年度
		[YEAR_PERIOD]: [
			{
				value: '0101',
				label: '年度',
			},
		],
		// 半年
		[HALF_YEAR_PERIOD]: [
			{
				value: '0401',
				label: '上半年',
			},
			{
				value: '0402',
				label: '下半年',
			},
		],
		// 季度
		[SEASON_PERIOD]: [
			{
				value: '0201',
				label: '第一季度',
			},
			{
				value: '0202',
				label: '第二季度',
			},
			{
				value: '0203',
				label: '第三季度',
			},
			{
				value: '0204',
				label: '第四季度',
			},
		],
		// 双月
		[DOBULE_MONTH_PERIOD]: [
			{
				value: '0501',
				label: '1月-2月',
			},
			{
				value: '0502',
				label: '3月-4月',
			},
			{
				value: '0503',
				label: '5月-6月',
			},
			{
				value: '0504',
				label: '7月-8月',
			},
			{
				value: '0505',
				label: '9月-10月',
			},
			{
				value: '0506',
				label: '11月-12月',
			},
		],
		// 月
		[MONTH_PERIOD]: [
			{
				value: '0301',
				label: '1月',
			},
			{
				value: '0302',
				label: '2月',
			},
			{
				value: '0303',
				label: '3月',
			},
			{
				value: '0304',
				label: '4月',
			},
			{
				value: '0305',
				label: '5月',
			},
			{
				value: '0306',
				label: '6月',
			},
			{
				value: '0307',
				label: '7月',
			},
			{
				value: '0308',
				label: '8月',
			},
			{
				value: '0309',
				label: '9月',
			},
			{
				value: '0310',
				label: '10月',
			},
			{
				value: '0311',
				label: '11月',
			},
			{
				value: '0312',
				label: '12月',
			},
		],
	};
	// 处理渲染周期的数据
	function renderPeriod(all, rendderAll) {
		let result = [];
		// 判断是否渲染全部周期类型
		if (rendderAll) {
			for (let item in periodListAll) {
				if (item == '00') {
					if (all) {
						periodListAll[item] && result.push(periodListAll[item]);
					}
					continue;
				} else {
					periodListAll[item] && result.push(periodListAll[item]);
				}
			}
		} else {
			// 根据后台配置的来显示不通的类型
			const config = getPriodConfig();
			result = all ? [periodListAll['00']] : [];
			config.forEach((item) => {
				periodListAll[item] && result.push(periodListAll[item]);
			});
		}
		return result;
	}
	// 处理周期文案
	function PERIOD_TEXT(id) {
		if (!id) return;
		id = id.toString();
		const year = id.substr(0, 4);
		const period = id.substr(4, 4);
		const type = id.substr(4, 2);
		const arr = periodListAll[type];
		const index = arr.findIndex((item) => item.value == period);
		const month = arr[index].label;
		// const index = periodList.findIndex((item)=> item.periodId == period)
		// const month = periodList[index].text
		return `${year}年 ${month}`;
	}
	// 处理对齐的O可以点击的周期
	function aliginPeriod(id) {
		// 根据后台配置的来显示不通的类型
		const config = getPriodConfig();
		// 年-双月-6月 -> 年度 5-6月  6月
		// id = '20220309';
		const result = [];
		config.forEach((item) => {
			const pID = formatAlignPeriod(item, id);
			pID && result.push(pID);
		});
		return result;
	}
	/***
	 * Function: 获取周期配置
	 * *******/
	function getPriodConfig() {
		const {periodCommand} = getStorage('QZZ_CORP_CONFIG') || {
			periodCommand: {},
		};
		const config = periodCommand?.periodTypes || ['01', '02', '03'];
		return config;
	}
	/*********
	 * 根据id和type返回对应层级的周期供对齐的O使用
	 * @params type: 后台配置的渲染的周期类型
	 * @params periodType： 当前周期id中的周期类型
	 * 这里的逻辑有点绕，对齐的话周期也要自下向上对齐，
	 * 首先要获取当前下级周期在上级周期中的对齐
	 * 例：id=20220309  设置的渲染周期类型为年/季度/月
	 * 要计算出9月份对应的年度/对应的季度，最后计算最后的月份
	 */
	function formatAlignPeriod(type, id) {
		let result = '';
		const list = periodListAll[type];
		const ptype = periodType(id);
		const value = periodValue(id);
		if (!type || !value) {
			retrun;
		}
		switch (type) {
			// 年
			case YEAR_PERIOD:
				{
					result = list[0].value;
				}
				break;
			// 季度
			case SEASON_PERIOD:
				{
					let index = -1;
					// 如果是季度
					if (ptype == SEASON_PERIOD) {
						// 季度的下标
						index = Number(value) - 1;
					} else if (ptype == MONTH_PERIOD) {
						// 一季度三个月 不能被3整除需要处理
						const remainder = Number(value) % 3;
						const floorValue = Math.floor(Number(value) / 3);
						const valueIndex = remainder > 0 ? floorValue + 1 : floorValue;
						index = valueIndex - 1;
					}
					if (index != -1) {
						result = list[index].value;
					}
				}
				break;
			// 月
			case MONTH_PERIOD:
				{
					if (ptype == MONTH_PERIOD) {
						const index = Number(value) - 1;
						result = list[index].value;
					}
				}
				break;
			// 半年
			case HALF_YEAR_PERIOD:
				{
					let index = -1;
					if (ptype == HALF_YEAR_PERIOD) {
						index = Number(value) - 1;
					} else if (ptype == SEASON_PERIOD) {
						index = Number(value) <= 2 ? 0 : 1;
					} else if (ptype == DOBULE_MONTH_PERIOD) {
						index = Number(value) <= 3 ? 0 : 1;
					} else if (ptype == MONTH_PERIOD) {
						index = Number(value) <= 6 ? 0 : 1;
					}
					if (index != -1) {
						result = list[index].value;
					}
				}
				break;
			// 双月
			case DOBULE_MONTH_PERIOD:
				{
					let index = -1;
					if (ptype == DOBULE_MONTH_PERIOD) {
						index = Number(value) - 1;
					} else if (ptype == MONTH_PERIOD) {
						const remainder = Number(value) % 2;
						const floorValue = Math.floor(Number(value) / 2);
						const valueIndex = remainder > 0 ? floorValue + 1 : floorValue;
						index = valueIndex - 1;
					}
					if (index != -1) {
						result = list[index].value;
					}
				}
				break;
		}
		return result;
	}
	/***
	 * Function: 设置周期的初始化值
	 * @params: type: 初始化的类型 1.当前周期的最小值2.当前周期的最大值3.全部周期
	 * return: 初始的周期ID
	 * *****/
	function initPeriod(type) {
		// const time = new Date();
		// const year = time.getFullYear();
		// const month = time.getMonth() + 1;
		// if(type == '1') {
		//     return `${year}03${month<10? ('0' + month) : month}`
		// } else {
		//     return `${year}0000`
		// }
		const QZZ_CORP_CONFIG = JSON.parse(
			localStorage.getItem('QZZ_CORP_CONFIG') || '{}'
		);
		const configPeriod = QZZ_CORP_CONFIG.periodCommand?.periodTypes;
		// 处理初始值 当前最大周期格式所处的周期
		let value = '';
		const time = new Date();
		const year = time.getFullYear();
		const month = time.getMonth() + 1;
		if (type == '1') {
			// 当前周期格式的最小值
			const minPeriod = configPeriod[configPeriod?.length - 1];
			value = formatPeriodMaxOrMinValue(minPeriod, month);
		} else if (type == '2') {
			// 当前周期格式的最大值
			const maxPeriod = configPeriod[0];
			value = formatPeriodMaxOrMinValue(maxPeriod, month);
		} else {
			return `${year}0000`;
		}
		return `${year}${value}`;
	}
	/****
	 * Function: 计算当前月份对齐的上级周期的对应值
	 * month: 月份  num: 一个周期对应几个月
	 * return 上级周期的下标值
	 * 例：现在是6月份  对应上级周期为半年的时候为上半年，返回值为01
	 *  对应上级周期为双月的时候上级周期对应值为5-6月份  返回值为03
	 * ****/
	function calcPeriodAlign(month, num) {
		const remainder = month % num;
		const floorValue = Math.floor(month / num);
		const result = remainder > 0 ? floorValue + 1 : floorValue;
		return result;
	}
	/****
	 * Function: 处理当前周期的最值问题
	 * *******/
	function formatPeriodMaxOrMinValue(period, month) {
		let value = '';
		switch (period) {
			case '01': // 年
				value = '0101';
				break;
			case '04': // 半年
				{
					const halfyear = calcPeriodAlign(month, 6);
					value = `04${halfyear > 10 ? halfyear : '0' + halfyear}`;
				}
				break;
			case '02': // 季度
				{
					const season = calcPeriodAlign(month, 3);
					value = `02${season > 10 ? season : '0' + season}`;
				}
				break;
			case '05': // 双月
				{
					const dobuleM = calcPeriodAlign(month, 2);
					value = `05${dobuleM > 10 ? dobuleM : '0' + dobuleM}`;
				}
				break;
			case '03': // 月
				value = `03${month > 9 ? month : '0' + month}`;
				break;
		}
		return value;
	}
	/****
	 * Function: 周期类型
	 * params: periodId 周期id
	 * return 周期类型 01 02 03 04 05
	 * ******/
	function periodType(periodId) {
		let result = '';
		if (periodId.length == 4) {
			result = periodId.toString().substring(0, 2);
		} else if (periodId.length == 8) {
			result = periodId.toString().substring(4, 6);
		}
		return result;
	}
	function periodValue(periodId) {
		let result = '';
		if (periodId.length == 4) {
			result = periodId.toString().substring(2, 4);
		} else if (periodId.length == 8) {
			result = periodId.toString().substring(6, 8);
		}
		return result;
	}
	return {PERIOD_TEXT, renderPeriod, aliginPeriod, initPeriod, periodType};
}
