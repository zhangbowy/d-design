import http from '../../../../utils/http';

/***create task****/
export const CREATE_TASK = (params) => {
    return http("/api/spf-cc/project/task/createTaskOnly", {method: 'post', params});
};