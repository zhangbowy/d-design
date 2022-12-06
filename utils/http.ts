import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {message} from "ant-design-vue";
import {getToken} from "./auth";

// 接口返回 形状
export interface ResData<T> {
    code: number;
    message: string;
    data: T;
}

// baseURL
const BASE_URL = '/api';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 60000,
});

instance.interceptors.request.use(
    (config) => {
        // 请求头 token配置
        const token = getToken();

        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: token,
                QZZ_ACCESS_TOKEN: token,
            };
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

instance.interceptors.response.use(
    // @ts-ignore
    (response: AxiosResponse) => {
        const res = <ResData<any>>response.data;
        // 文件流
        if (res instanceof Blob) {
            return res;
        }
        // 正确状态
        if (res.code === 1) {
            return res || true;
        }

        // 登录失效
        if (res.code === -1) {
            // useUserStoreWithOut().logout();
        }

        // 异常
        message.error(res.message);
        return null;
    },
    (error) => {
        console.log('err' + error); // for debug
        // 没权限时，不再重复提示
        if (error === '没有操作权限') return;
        message.error('网络超时，稍后再试吧');
    },
);

const request = <T = any>(
    config: AxiosRequestConfig | string,
    options?: AxiosRequestConfig,
): Promise<T> => {
    if (typeof config === 'string') {
        if (!options) {
            return instance.request<T, T>({
                url: config,
            });
            // throw new Error('请配置正确的请求参数');
        } else {
            return instance.request<T, T>({
                url: config,
                ...options,
            });
        }
    } else {
        return instance.request<T, T>(config);
    }
};

/**
 * get
 * @param config
 * @param options
 */
export function get<T = any>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> {
    return request({...config, method: 'GET'}, options);
}

/**
 * post
 * @param config
 * @param options
 */
export function post<T = any>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> {
    return request({...config, method: 'POST'}, options);
}

export default request;
export type {AxiosInstance, AxiosResponse};
