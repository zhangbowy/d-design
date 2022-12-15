/*****
 * 周期规则
 *
 * 一共10位 前4位是年份5-6是类型7-8是下标9-10是开始月份
 *
 * 类型：
 * 01 年度 12个月
 * 02 季度 3个月
 * 03 月 1个月
 * 04 半年 6个月
 * 05 双月 2个月
 * 06 4个月
 *
 * */
import dayjs from 'dayjs';
import { IResult, IFormatYear } from '@/components/cycle/src/type'

const getPeriodConfig = (starMonth?: string, periodTypes?: string) => {
    try {
        // const config = getStorage('LINK-OKR-CONFIG');
        // const {baseOkrCorpConfigCommand} = config;
        // const {periodCommand} = baseOkrCorpConfigCommand || {};
        // const starMonth = periodCommand?.startMonth || '01';
        // const periodTypes = periodCommand?.periodTypes && periodCommand.periodTypes[0] || '2022020401';
        const type = formatPeriodType(periodTypes || '2022020401');
        return { starMonth: starMonth || '01', type: type };
        // return { starMonth: '04', type: '02' }
    } catch (error) {
        console.log(error);
        return {};
    }
};

const yearList = () => {
    const result: number[] = [];
    const currentYear = dayjs().year();
    for (let i = 2021; i < currentYear + 4; i++) {
        result.push(i);
    }
    return result;
};

export const createPeriodYearList = () => {
    const result: IResult[] = [];
    yearList().forEach((i) => {
        result.push({
            value: i + '010000',
            label: i + '',
        });
    });
    return result;
};

export const createPeriodNormalList = () => {
    let periodArr: IResult[] = [];
    yearList().forEach((year) => {
        periodArr = periodArr.concat([...formatPeriodList(year)]);
    });
    return periodArr;
};

export const initPeriodValue = () => {
    const { type, starMonth } = getPeriodConfig();
    return type && starMonth ? formatPeriodId(type, starMonth) : '';
};

// 格式化周期id
export const formatPeriodId = (type: string, starMonth: string) => {
    let currentYear = dayjs().year();
    let month = dayjs().month() + 1;
    let index = '01';
    // 如果当前月份小于起始月份，说明是下一年的 例：起始月份为4月，三个月一个周期，2023年的1月-3月 对应id 2022020404
    if (month < Number(starMonth)) {
        month += 12;
        currentYear--;
    }
    const remainder = (month - Number(starMonth)) % periodTypeDelay(type);
    if (remainder !== 0) {
        const id1 = Math.ceil((month - Number(starMonth)) / periodTypeDelay(type))

        index = id1 < 10 ? '0' + id1 : id1 + '';
    } else {
        const id1 = ((month - Number(starMonth)) / periodTypeDelay(type) + 1)
        index = id1 < 10 ? '0' + id1 : id1 + '';
    }
    // if(type === '01' ) { // 12个月
    //     // index = '01'
    //     if(remainder !== 0) {
    //         index = '0' + Math.ceil(((month - starMonth ) / periodTypeDelay(type)))
    //     } else {
    //         index = '0' + (((month - starMonth ) / periodTypeDelay(type)) + 1)
    //     }
    // } else if(type === '02') { // 3个月
    //     if(remainder !== 0) {
    //         index = '0' + Math.ceil(((month - starMonth ) / periodTypeDelay(type)))
    //     } else {
    //         index = '0' + (((month - starMonth ) / periodTypeDelay(type)) + 1)
    //     }
    // } else if(type === '03') { // 1个月
    //     if(remainder !== 0) {
    //         index = '0' + Math.ceil(((month - starMonth ) / periodTypeDelay(type)))
    //     } else {
    //         index = '0' + (((month - starMonth ) / periodTypeDelay(type)) + 1)
    //     }
    // } else if(type === '04') {// 6个月
    //     if(remainder !== 0) {
    //         index = '0' + Math.ceil(((month - starMonth ) / periodTypeDelay(type)))
    //     } else {
    //         index = '0' + (((month - starMonth ) / periodTypeDelay(type)) + 1)
    //     }
    // } else if(type === '05') { // 2个月
    //     if(remainder !== 0) {
    //         index = '0' + Math.ceil(((month - starMonth ) / periodTypeDelay(type)))
    //     } else {
    //         index = '0' + (((month - starMonth ) / periodTypeDelay(type)) + 1)
    //     }
    // } else if(type === '06') { // 4个月
    //     if(remainder !== 0) {
    //         index = '0' + Math.ceil(((month - starMonth ) / periodTypeDelay(type)))
    //     } else {
    //         index = '0' + (((month - starMonth ) / periodTypeDelay(type)) + 1)
    //     }
    // }
    return `${currentYear}${type}${index}${starMonth}`;
};

/*
 *ex:
 * 2022060304
 * 周期文案：2022年12月2023年3月
 * 2022 4个月为一个周期 下标识03 开始月份是04
 * 04-07 第一个周期  08-11 第二个周期 12-3 第三个周期
 *
 * */

export const formatPeriodList = (year: number) => {
    const { type, starMonth } = getPeriodConfig();
    const delay = Number(periodTypeDelay(type as string));
    const result = formatYearArray(year, delay, type, starMonth);
    return result;
};

/*****
 *
 * 根据年份和开始月份计算出以开始月份为首的当年的的月份排序数组 数组长度为12
 **/
const formatMonthArray = (year: number, starMonth: string) => {
    const result: IFormatYear[] = [];
    let start = Number(starMonth) || 1;
    for (let i = 0; i < 12; i++) {
        if (start > 12) {
            result.push({
                year: year,
                value: start - 12,
                label: `${year + 1}年${start - 12}月`,
            });
        } else {
            result.push({
                year: year,
                value: start,
                label: `${year}年${start}月`,
            });
        }
        start++;
    }
    return result;
};

/***
 * 根据类型和每年的月份数组计算出每年的周期
 **/
const formatYearArray = (year: number, delay: number, type = '', starM = '') => {
    const arr = formatMonthArray(year, starM);
    const len = 12 / delay;
    const result: IResult[] = [];
    let starMonth = 0;
    for (let i = 0; i < len; i++) {
        const start = arr[starMonth];
        const end = arr[starMonth + delay - 1];
        // 下标加1
        const index = i + 1 < 10 ? '0' + (i + 1) : i + 1;
        result.push({
            value: `${start.year}${type}${index}${starM}`,
            label: `${start.label}-${end.label}`,
        });
        starMonth += delay;
    }
    return result;
};

export const periodText = (id: string | number) => {
    if (id) {
        let year = formatPeriodYear(id);
        const type = formatPeriodType(id);
        const index = Number(formatPeriodIndex(id));
        const startMonth = formatPeriodStart(id);
        const delay = periodTypeDelay(type);
        if (type === '01') {
            return `${year}年 年度`;
        } else {
            let starM = Number(startMonth) + delay * (index - 1);
            let endM = Number(starM) + delay - 1;
            let startNextYear = false;
            let endNextYear = false;
            if (starM > 12) {
                starM = starM - 12;
                startNextYear = true;
            }
            if (endM > 12) {
                endM = endM - 12;
                endNextYear = true;
            }
            const startResultYear = startNextYear ? Number(year) + 1 : year;
            const endResultYear = endNextYear ? Number(year) + 1 : year;
            const start = `${startResultYear}年${starM}月`;
            const end = `${endResultYear}年${endM}月`;
            const result = `${start}-${end}`;
            return result;
        }
    } else {
        return '';
    }
};

// 周期间隔
export const periodTypeDelay = (type: string) => {
    let result = 4;
    switch (type) {
        case '01':
            result = 12;
            break;
        case '02':
            result = 3;
            break;
        case '03':
            result = 1;
            break;
        case '04':
            result = 6;
            break;
        case '05':
            result = 2;
            break;
        case '06':
            result = 4;
            break;
        default:
            result = 4;
            break;
    }
    return result;
};

export const formatPeriodYear = (id: string | number) => {
    return (id && id.toString().substring(0, 4)) || '';
};

export const formatPeriodType = (id: string | number) => {
    return (id && id.toString().substring(4, 6)) || '';
};

export const formatPeriodIndex = (id: string | number) => {
    return (id && id.toString().substring(6, 8)) || '';
};

export const formatPeriodStart = (id: string | number) => {
    return (id && id.toString().substring(8, 10)) || '';
};
