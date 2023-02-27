import http from '@/api/http';

/***up data task status****/
export const RENEW_TASK_STATUS = (data) => {
    return http("/api/spf-cc/qzp/updateTaskStatus", { method: "post", data });
};

/***get corp space id****/
export const QUERY_CORP_SPACE = (params) => {
    return http("/api/spf-cc/okr/organization/getCustomSpace", { method: "get", params });
};

/***get dd permission****/
export const QUERY_DD_PERMISSION = (data) => {
    return http("/api/spf-cc/okr/organization/customSpacePrivileges", { method: "post", data });
};

/***up data task****/
export const UP_DATA_TASK = (data) => {
    return http("/api/spf-cc/qzp/updateTask", { method: "post", data });
};

/*** get task link count ****/
export const GET_RELEVANCE_CNT = (params) => {
    return http("/api/spf-cc/qzp/getRelevanceCount", { method: "get", params });
};

/****删除任务******/
export const DELETE_TASK = (params) => {
    return http("/api/spf-cc/qzp/deleteTask", { method: "get", params });
}
