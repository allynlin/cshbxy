import axios from 'axios';
import {message} from 'antd';
import qs from 'qs';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'
import Cookie from "js-cookie";
import {BaseInfo, version} from "../../baseInfo";
import {winRe} from "../../baseInfo";

export const MethodType = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
};

// 对于请求错误的提示
const errorTip = (code: string) => {
    switch (code) {
        case '400':
            message.error('请求错误');
            break;
        case '401':
            message.error('未授权，请登录');
            break;
        case '403':
            message.error('拒绝访问');
            break;
        case '404':
            message.error(`请求地址出错: ${code}`);
            break;
        case '408':
            message.error('请求超时');
            break;
        case '500':
            message.error('服务器内部错误');
            break;
        case '501':
            message.error('服务未实现');
            break;
        case '502':
            message.error('网关错误');
            break;
        case '503':
            message.error('服务不可用');
            break;
        case '504':
            message.error('网关超时');
            break;
        case '505':
            message.error('HTTP版本不受支持');
            break;
        default:
            message.error(`连接出错: ${code}`);
    }
}

// 判断是跳转到 home 下的错误页面还是根目录下的错误页面
const toErrorPage = (to: string) => {
    // 判断 URL 中是否有 home 字符串
    const url = window.location.pathname;
    // 遍历字符串，如果有 home 字符串，就跳转到 home 下的错误页面
    for (let i = 0; i < url.length; i++) {
        if (url[i] === 'h' && url[i + 1] === 'o' && url[i + 2] === 'm' && url[i + 3] === 'e') {
            winRe(`/home${to}`);
            return;
        }
    }
    // 否则跳转到根目录下的错误页面
    winRe(to);
}

/**
 * 模块说明:有api_token的请求
 */
export const Request = (api: String, method = MethodType.GET, params = {}, config = {headers: {}}) => {
    const apiToken = Cookie.get('token');
    // 如果不是登录和注册接口（/login 或 /register 开头），POST 请求，没有获取到 token，就跳转到登录页面
    if (apiToken === undefined && method === MethodType.POST && !api.startsWith('/login') && !api.startsWith('/register')) {
        toErrorPage('/403');
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
            // 判断 res.data 是字符串还是 json 对象
            if (typeof res.data === 'string') {
                // 字符串格式： Message{code=101, msg='版本校验失败'}
                // 去除字符串多余元素，只保留 code 和 msg
                const code = res.data.split('=')[1].split(',')[0].replace(/'/g, '"');
                if (code === '101' || code === '103') {
                    winRe('/103')
                } else if (code === "401" || code === "403") {
                    Cookie.remove('token');
                    Cookie.remove('userType');
                    winRe('/403')
                }
                return
            }
            NProgress.done(true);
            // 如果后端返回 403 则拦截当前页面请求，返回登录页面
            if (res.data.code === 403) {
                Cookie.remove('token');
                Cookie.remove('userType');
                reject(res.data)
                winRe('/403')
            } else if (res.data.code === 500) {
                reject(res.data)
                toErrorPage('/500');
            } else if (res.data.code >= 200 && res.data.code < 400) {
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
            console.error(error);
            if (error.response) {
                errorTip(error.response.status);
            } else {
                message.error('连接服务器失败');
            }
            reject(error);
        });
    });
};