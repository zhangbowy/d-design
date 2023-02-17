import request from './http'

/**************查询可以被关联项目*******************/
export const GET_PROJECT = (params) => {
    return request("/api/spf-cc/project/queryProjectLink", { method: 'get', params });
};

/******添加关联*****/
export const ADD_RELATION = (data) => {
    return request("/api/spf-cc/okr/linked/okrLinked", { method: 'post', data });
};

/******添加OKR关联*****/
export const ADD_OKR_RELATION = (data) => {
    return request("/api/spf-cc/projectRelevance/addRelevance", { method: 'post', data });
};


// 查询任务列表
export const GET_TASK_LIST = (params) => {
    return request("/api/spf-cc/okr/linked/queryTaskLink", { method: 'get', params });
};

/*********获取我的OKR列表******/
export const GET_OKRLIST_BY_USERID = (params) => {
    return request("/api/spf-cc/okr/v2/o/list", { method: 'get', params });
};

/**************查询已经关联的项目*******************/
export const GET_CORRELATION_INFO = (params) => {
    return request("/api/spf-cc/project/queryRelevanceInfo", { method: 'get', params });
};

/**************删除关联*******************/
export const DELETE_CORRELATION = (data) => {
    return request("/api/spf-cc/projectRelevance/deleteRelevance", { method: 'post', data });
}
