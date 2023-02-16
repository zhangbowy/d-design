import http from '@/api/http';

/***get corp space id****/
export const QUERY_CORP_SPACE = (params) => {
    return http("/api/spf-cc/okr/organization/getCustomSpace", { method: "get", params });
};
/***get dd permission****/
export const QUERY_DD_PERMISSION = (data) => {
    return http("/api/spf-cc/okr/organization/customSpacePrivileges", { method: "post", data });
};