import axios from 'axios';
import qs from 'qs';
import {BaseInfo} from "../../baseInfo";
import {message} from "antd";
import {SStorage} from "../localStrong";

/**
 * 请求方法,内置 GET 和 POST
 */
export const MethodType = {
    GET: 'GET',
    POST: 'POST'
};

/**
 * Axios 请求
 * @param {string} api 请求的 api
 * @param {string} [method] 请求的方法类型，默认为 GET
 * @param {object} [params] 请求的参数
 * @param {object} [config] 请求的配置头部
 * @returns {Promise<any>} 返回一个 Promise
 * @example Request('/api', 'GET', {name: 'allynlin'}) // 请求 /api，请求方法为 GET，请求参数为 {name: 'allynlin'}
 * @version 1.0.0
 */
export const Request = (api: String, method = MethodType.GET, params = {}, config = {headers: {}}) => {
    const apiToken = SStorage.get('token');
    const baseURL = BaseInfo;
    const data = (method === 'GET') ? 'params' : 'data';
    let headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Authorization': `${apiToken}`,
    };
    if (config.headers) {
        headers = {
            ...headers,
            ...config.headers
        }
    }

    const axiosConfig = {
        url: `${baseURL}${api}`,
        method,
        [data]: qs.stringify(params),
        headers,
        timeout: 5000,
    };

    return new Promise((resolve, reject) => {
        axios(axiosConfig).then(res => {
            if (res.data.token !== null && res.data.token !== undefined)
                SStorage.set("token", res.data.token);
            resolve(res.data);
        }).catch(error => {
            message.error(error.message + "，请联系管理员");
            reject(error);
        })
    });
};
