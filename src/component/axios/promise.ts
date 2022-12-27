import axios from 'axios';
import qs from 'qs';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'
import Cookie from "js-cookie";
import setCookie from "../setCookie";
import {BaseInfo, version} from "../../baseInfo";
import {rootNavigate} from "../../App";

export const MethodType = {
    GET: 'GET',
    POST: 'POST'
};

/**
 * 模块说明:有api_token的请求
 */
export const Request = (api: String, method = MethodType.GET, params = {}, config = {headers: {}}) => {
    const apiToken = Cookie.get('cshbxy-oa-token');
    const language = Cookie.get('cshbxy-oa-language') || 'en_US';
    // 如果不是登录和注册接口（/login 或 /register 或 /query 开头），POST 请求，没有获取到 token，就跳转到登录页面
    if (apiToken === undefined && method === MethodType.POST && !api.startsWith('/api/user') && !api.startsWith('/query')) {
        rootNavigate('/403');
        return
    }
    const baseURL = BaseInfo;
    const data = (method === 'GET') ? 'params' : 'data';
    let headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Authorization': `${apiToken}`,
        'version': version,
        'Accept-Language': language
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
        timeout: 10000
    };

    return new Promise((resolve, reject) => {
        NProgress.inc();
        axios(axiosConfig).then(res => {
            if (res.data.code === 401 || res.data.code === 403) {
                reject(res.data)
                rootNavigate('/403');
                return;
            }
            if (res.data.code === 500) {
                reject(res.data)
                rootNavigate('/500');
                return;
            }
            if (res.data.token !== null && res.data.token !== undefined)
                setCookie({name: "cshbxy-oa-token", value: res.data.token})
            resolve(res.data);
        }).catch(error => {
            reject(error);
        }).finally(() => {
            NProgress.done(true);
        })
    });
};
