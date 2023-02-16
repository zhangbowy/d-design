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

/**
 * judge string did ''
 */
export const judgeStrNull = (str) => {
    if (str.replace(/\s*/g, "").length == 0) {
        return true;
    } else {
        return false;
    }
};

/**
 * judge object did null
 * @param {Object} obj
 */
export const checkNullObj = (obj) => {
    if (obj == null) {
        return true;
    }
    if (Object.keys(obj).length == 0) {
        return true;
    } else {
        return false;
    }
};

/**
 * format date
 * @param {Date} date
 */
export const formatDate = (date) => {
    let y = date.getFullYear();
    let MM = date.getMonth() + 1;
    MM = MM < 10 ? "0" + MM : MM;
    let d = date.getDate();
    d = d < 10 ? "0" + d : d;
    let h = date.getHours();
    h = h < 10 ? "0" + h : h;
    let m = date.getMinutes();
    m = m < 10 ? "0" + m : m;
    let s = date.getSeconds();
    s = s < 10 ? "0" + s : s;
    return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
};

/**
 * splice time ss
 */
export const sliceSS = (time) => {
    let num = time?.lastIndexOf(":");
    let newTime = time?.slice(0, num);
    return newTime;
};