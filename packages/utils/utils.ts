
import { TokenKey } from '../enum'

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
    return sessionStorage.getItem(TokenKey) || '';
}

export function setToken(token: string) {
    sessionStorage.setItem(TokenKey, token);
}

export function removeToken() {
    sessionStorage.setItem(TokenKey, '');
}
