import http from '../../../utils/http'

/******************************************about oss upload**********************************************/
export const GET_STS = (params) => {
	return http('/api/spf-cc/aliyun/oss/upload/getSts', 'post', params);
}
export const GET_FILES_PATH = (params) => {
	return http('/api/spf-cc/aliyun/oss/upload/applyMaterials', 'post', params);
}