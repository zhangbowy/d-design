import http from '@/api/http';

/******************************************about oss upload**********************************************/
export const GET_STS = (params) => {
    return http('/api/spf-cc/aliyun/oss/upload/getSts', { method: 'post', params });
}
export const GET_FILES_PATH = (params) => {
    return http('/api/spf-cc/aliyun/oss/upload/applyMaterials', { method: 'post', params });
}
