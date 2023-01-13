import axios from 'axios';
import qs from 'qs';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'
import Cookie from "js-cookie";
import setCookie from "../setCookie";
import {BaseInfo, version} from "../../baseInfo";

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
    };

    return new Promise((resolve, reject) => {
        NProgress.done(true);
        NProgress.inc();
        axios(axiosConfig).then(res => {
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
