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
};