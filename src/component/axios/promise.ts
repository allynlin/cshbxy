import axios from 'axios';
import {message} from 'antd';
import qs from 'qs';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'
import Cookie from "js-cookie";
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
    const apiToken = Cookie.get('token');
    // 如果不是登录和注册接口（/login 或 /register 开头），POST 请求，没有获取到 token，就跳转到登录页面
    if (apiToken === undefined && method === MethodType.POST && !api.startsWith('/login') && !api.startsWith('/register')) {
        rootNavigate('/403');
        return
    }
    const baseURL = BaseInfo;
    const data = (method === 'GET') ? 'params' : 'data';
    let headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Authorization': `${apiToken}`,
        'version': `${version}`
    };
    if (config.headers) {
        headers = {
            ...headers,
            ...config.headers
        }
    }

    return new Promise((resolve, reject) => {
        NProgress.inc();
        axios({
            url: `${baseURL}${api}`,
            method,
            [data]: qs.stringify(params),
            headers,
            timeout: 10000
        }).then(res => {
            NProgress.done(true);
            switch (res.data.code) {
                case 101:
                    reject(res.data)
                    rootNavigate('/101')
                    break;
                case 103:
                    reject(res.data)
                    rootNavigate('/103')
                    break;
                case 403:
                    Cookie.remove('token');
                    Cookie.remove('userType');
                    reject(res.data)
                    rootNavigate('/403');
                    break;
                case 500:
                    reject(res.data)
                    rootNavigate('/500');
                    break;
            }
            // // 如果后端返回 403 则拦截当前页面请求，返回登录页面
            if (res.data.code >= 200 && res.data.code < 400) {
                // 如果返回了 token 则更新本地 token
                if (res.data.token !== null && res.data.token !== undefined)
                    Cookie.set('token', res.data.token, {expires: 7, path: '/', sameSite: 'strict'})
                resolve(res.data)
            } else {
                message.error(res.data.msg)
                reject(res.data)
            }
        }).catch(error => {
            NProgress.done(true);
            message.error(error.message)
            reject(error);
        });
    });
};
