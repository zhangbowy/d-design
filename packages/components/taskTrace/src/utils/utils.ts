/**
 * splice time ss
 */
export const sliceSS = (time) => {
    let num = time?.lastIndexOf(":");
    let newTime = time?.slice(0, num);
    return newTime;
};

/**
 * get task main id
 */
export const getTaskMainId = (obj) => {
    let bizId = "";
    if (obj.type == "SUB_TASK") {
        bizId = obj.bizId;
    } else if (obj.type == "MAIN_TASK") {
        bizId = obj.id;
    }
    return bizId;
};

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