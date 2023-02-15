import http from '@/api/http'
/***根据输入搜索人员****/
export const SEARCH_USER = (params: any) => {
    return http('/api/member/user/aggr/fuzzy', { method: 'get', params });
}
export const SEARCH_ZONE_USER = (params: any) => {
    return http('/api/member/user/aggr/allUserFuzzy', { method: 'get', params });
}
/**********获取部门信息**********/
export const GET_DEPT_INFO = (parmas: any) => {
    // @ts-ignore
    return http('/api/member/user/pick/dept', { method: 'get', parmas });
}
/**********获取筛选结果**********/
export const GET_USERIDS = (parmas: any) => {
    // @ts-ignore
    return http('/api/member/user/pick/getUserIds', { method: 'get', parmas });
}
