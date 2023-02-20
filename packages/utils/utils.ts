
// import { TokenKey } from '../enum'

/*
 * 返回页面中的查询参数
 * */
export const getQueryVariable = (sKey) => {
    let resObj = {};
    let reg = /(\w+)=(\w+)/g;
    let sUrl = window.location.href;
    while (reg.exec(sUrl)) {
        resObj[RegExp.$1]
            ? (resObj[RegExp.$1] = [].concat(resObj[RegExp.$1], RegExp.$2))
            : (resObj[RegExp.$1] = RegExp.$2);
    }
    console.log('resObj', resObj)
    if (sKey) {
        return resObj[sKey] ? resObj[sKey] : "";
    }
    return resObj;
}


// 防抖
export const debounce = (fn: (value: any) => void, time = 500) => {
    let timer: any;
    return (args?: any) => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => {
            fn(args);
            timer = null
        }, time)
    }
}
    ;


export function getToken() {
    return localStorage.getItem('QZZ_ACCESS_TOKEN') || localStorage.getItem('QZP_ACCESS_TOKEN') || localStorage.getItem('G_TOKEN');
}

export function setToken(token: string) {
    localStorage.setItem('QZZ_ACCESS_TOKEN', token);
}

export function removeToken() {
    localStorage.setItem('QZZ_ACCESS_TOKEN', '');
}


// 存储localStorage
export function getStorage(key) {
    const value = localStorage.getItem(key) || "";
    return value ? JSON.parse(value) : null;
}
