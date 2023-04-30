const tips = "您当前浏览器暂不支持现代 CSS Selectors 特性，本系统已暂停对低版本浏览器的支持，请更新当前浏览器或更换受支持的浏览器访问。建议使用现代浏览器（如 Chrome,Edge,Firefox 等等）"
export const getBrowserInfo = () => {
    const browserInfo = navigator.userAgent.toLowerCase();
    // 检测 chrome 浏览器，如果 chrome 浏览器的内核低于 88 版本，就提示用户请使用最新版 chrome 浏览器
    if (browserInfo.indexOf('chrome') > -1) {
        // @ts-ignore
        const version = browserInfo.match(/chrome\/([\d.]+)/)[1];
        if (parseInt(version) < 88) {
            alert(tips);
            return false
        }
    }
    // 检测 Edge 浏览器，要求最低版本为 88
    if (browserInfo.indexOf('edg') > -1) {
        // @ts-ignore
        const version = browserInfo.match(/edg\/([\d.]+)/)[1];
        if (parseInt(version) < 88) {
            alert(tips);
            return false
        }
    }
    // 检测 Firefox 浏览器，要求最低版本为 78
    if (browserInfo.indexOf('firefox') > -1) {
        // @ts-ignore
        const version = browserInfo.match(/firefox\/([\d.]+)/)[1];
        if (parseInt(version) < 78) {
            alert(tips);
            return false
        }
    }
    // 检测 Opera 浏览器，要求最低版本为 74
    if (browserInfo.indexOf('opr') > -1) {
        // @ts-ignore
        const version = browserInfo.match(/opr\/([\d.]+)/)[1];
        if (parseInt(version) < 74) {
            alert(tips);
            return false
        }
    }
    // 检测 Safari 浏览器，要求最低版本为 14
    if (browserInfo.indexOf('safari') > -1 && browserInfo.indexOf('chrome') === -1) {
        // @ts-ignore
        const version = browserInfo.match(/version\/([\d.]+)/)[1];
        if (parseInt(version) < 14) {
            alert(tips);
            return false
        }
    }
    // 检测 Chrome Android 浏览器，要求最低版本为 88
    if (browserInfo.indexOf('chrome') > -1 && browserInfo.indexOf('edg') === -1) {
        // @ts-ignore
        const version = browserInfo.match(/chrome\/([\d.]+)/)[1];
        if (parseInt(version) < 88) {
            alert(tips);
            return false
        }
    }
    // 检测 Firefox Android 浏览器，要求最低版本为 79
    if (browserInfo.indexOf('firefox') > -1 && browserInfo.indexOf('android') > -1) {
        // @ts-ignore
        const version = browserInfo.match(/firefox\/([\d.]+)/)[1];
        if (parseInt(version) < 79) {
            alert(tips);
            return false
        }
    }
    // 检测 Opera Android 浏览器，要求最低版本为 63
    if (browserInfo.indexOf('opr') > -1 && browserInfo.indexOf('android') > -1) {
        // @ts-ignore
        const version = browserInfo.match(/opr\/([\d.]+)/)[1];
        if (parseInt(version) < 63) {
            alert(tips);
            return false
        }
    }
    // 检测 Safari iOS 浏览器，要求最低版本为 14
    if (browserInfo.indexOf('safari') > -1 && browserInfo.indexOf('chrome') === -1 && browserInfo.indexOf('android') === -1) {
        // @ts-ignore
        const version = browserInfo.match(/version\/([\d.]+)/)[1];
        if (parseInt(version) < 14) {
            alert(tips);
            return false
        }
    }
    // 检测 Samsung Internet 浏览器，要求最低版本为 15
    if (browserInfo.indexOf('samsungbrowser') > -1) {
        // @ts-ignore
        const version = browserInfo.match(/samsungbrowser\/([\d.]+)/)[1];
        if (parseInt(version) < 15) {
            alert(tips);
            return false
        }
    }
    // 检测 WebView Android 浏览器，要求最低版本为 88
    if (browserInfo.indexOf('wv') > -1 && browserInfo.indexOf('android') > -1) {
        // @ts-ignore
        const version = browserInfo.match(/wv\/([\d.]+)/)[1];
        if (parseInt(version) < 88) {
            alert(tips);
            return false
        }
    }
    return true
}
