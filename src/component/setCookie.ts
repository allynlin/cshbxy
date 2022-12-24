import Cookie from "js-cookie";

interface cookie {
    name: string;
    value: string;
}

const setCookie = (cookie: cookie) => {
    Cookie.set(cookie.name, cookie.value, {
        expires: 7,
        path: '/',
        sameSite: 'strict'
    })
}

export default setCookie;
