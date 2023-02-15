import request from './http'

/**************查询可以被关联项目*******************/
export const GET_PROJECT = (params) => {
    return request("/api/spf-cc/project/queryProjectLink", { method: 'get', params });
};
