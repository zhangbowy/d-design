import http from '@/api/http';

/***get all task user****/
export const QUERY_TASK_USER = async (params) => {
    return http('/api/spf-cc/qzp/queryTaskUserList', { method: "get", params })
}