import Cookie from "js-cookie";

interface cookie {
    name: string;
    value: string;
}

/**
 * 设置 cookie
 * @param {cookie} cookie 需要设置的 cookie
 * @example setCookie({name: 'name', value: 'allynlin'}) // 设置 name 的数据
 * @version 1.0.0
 */
const setCookie = (cookie: cookie) => {
    Cookie.set(cookie.name, cookie.value, {
        expires: 7,
        path: '/',
        sameSite: 'strict'
    })
}

export default setCookie;
