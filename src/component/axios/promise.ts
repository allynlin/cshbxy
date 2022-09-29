import axios from 'axios';
import {message} from 'antd';
import qs from 'qs';
import NProgress from 'nprogress';
import Cookie from "js-cookie";
import {BaseURL} from "../../baseURL";

export const MethodType = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
};

/**
 * 模块说明:有api_token的请求
 */
export const Request = (api: String, method = MethodType.GET, params = {}, config = {headers: {}}) => {
    const apiToken = Cookie.get('token');
    const baseURL = BaseURL;
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

    return new Promise((resolve, reject) => {
        axios({
            url: `${baseURL}${api}`,
            method,
            [data]: qs.stringify(params),
            headers,
        }).then(res => {
            // 如果后端返回 403 则拦截当前页面请求，返回登录页面
            if (res.data.code === 403) {
                message.error(res.data.msg)
                Cookie.remove('token');
                Cookie.remove('userType');
                reject(res.data)
                window.location.replace('/403')
            } else if (res.data.code === 500) {
                NProgress.done(true);
                message.error(res.data.msg)
                reject(res.data)
                window.location.replace('/500')
            } else if (res.data.code >= 200 && res.data.code < 400) {
                // 如果返回了 token 则更新本地 token
                if (res.data.token !== null)
                    Cookie.set('token', res.data.token, {expires: 7, path: '/', sameSite: 'strict'})
                resolve(res.data)
            } else {
                NProgress.done(true);
                message.error(res.data.msg)
                reject(res.data)
            }
        }).catch(error => {
            NProgress.done(true);
            console.error(error);
            message.error(error.message);
            reject(error);
        });
    });
};