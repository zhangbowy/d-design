import http from '@/api/http';

/***check task map****/
export const QUERY_TASK_MAP = (params) => {
    return http("/api/spf-cc/qzp/queryTaskMap", { method: "get", params });
};

export const ADD_COMMENT = (data) => {
    return http('/api/spf-cc/comment/addComment', { method: 'post', data });
}

export const GET_COMMENT = (params) => {
    return http('/api/spf-cc/comment/queryComments', { method: "get", params });
}

/***get unread task count****/
export const KEY_EVENT_WRITE = (data) => {
    return http('/api/spf-cc/qzp/keyEventsWrite', { method: "post", data })
}

/***get dd permission****/
export const QUERY_MAP_EXEC = (params) => {
    return http("/api/spf-cc/qzp/queryParticipantGroup", { method: "get", params });
};

/***get corp space id****/
export const QUERY_CORP_SPACE = (params) => {
    return http("/api/spf-cc/okr/organization/getCustomSpace", { method: "get", params });
};
/***get dd permission****/
export const QUERY_DD_PERMISSION = (data) => {
    return http("/api/spf-cc/okr/organization/customSpacePrivileges", { method: "post", data });
};

/***check task map****/
export const QUERY_KEY_EVENTS = (params) => {
    return http("/api/spf-cc/qzp/queryKeyEvents", { method: "get", params });
};