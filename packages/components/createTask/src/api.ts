import http from '@/api/http';

/***create task****/
export const CREATE_TASK = (data) => {
    return http("/api/spf-cc/project/task/createTaskOnly", { method: 'post', data });
};

/***create task****/
export const CREATE_PROJECT_TASK = (data) => {
    return http("/api/spf-cc/project/task/createTask", { method: "post", data });
};