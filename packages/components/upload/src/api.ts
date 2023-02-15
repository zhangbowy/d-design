import http from '@/api/http';

/******************************************about oss upload**********************************************/
export const GET_STS = (data) => {
    return http('/api/spf-cc/aliyun/oss/upload/getSts', { method: 'post', data });
}
export const GET_FILES_PATH = (data) => {
    return http('/api/spf-cc/aliyun/oss/upload/applyMaterials', { method: 'post', data });
}
