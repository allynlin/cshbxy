import React, {useEffect, useLayoutEffect, useState} from "react";
import Cookie from 'js-cookie';
import intl from 'react-intl-universal';
import {unstable_HistoryRouter as HistoryRouter} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import RouterWaiter from "react-router-waiter"
import {useDispatch, useSelector} from "react-redux";
import {ConfigProvider, message} from "antd";

import Spin from "./component/loading/Spin";
import {checkUser, getLowVersion, getVersion} from "./component/axios/api";
import {login} from "./component/redux/isLoginSlice";
import {Department, Employee, Leader} from "./component/redux/userTypeSlice";
import {setVersion} from "./component/redux/serverVersionSlice";
import {darkTheme, lightTheme, sysTheme} from "./component/redux/sysColorSlice";
import {dark, light} from "./component/redux/themeSlice";
import {LStorage} from "./component/localStrong";
import {inline, vertical} from "./component/redux/menuModeSlice";
import {Chinese, English} from "./component/redux/userLanguageSlice";
import {setUser} from "./component/redux/userInfoSlice";
import {setLowVersion} from "./component/redux/serverLowVersionSlice";
import ChangeSystem from "./component/ChangeSystem";
import {setToken} from "./component/redux/userTokenSlice";

import enUS from "antd/es/locale/en_US";
import zhCN from "antd/es/locale/zh_CN";

import './App.scss';
import routes from "./Router/routes";
import {getBrowserInfo} from "./checkBrowser";
import {version} from "./baseInfo";

// 导入自定义语言包
const locales = {
    'English': require('./component/Language/en-US.json'),
    'Chinese': require('./component/Language/zh-CN.json')
}

// 定义历史路由，用于 hooks 外路由跳转
const history = createBrowserHistory({window});

/**
 *  历史路由，用于 hooks 外路由跳转，比如在 hooks 外使用 rootNavigate.push('/login')
 * @param to 跳转路径
 */
export const rootNavigate = (to: string) => {
    history.push(`${process.env.PUBLIC_URL}${to}`)
};

export default function App() {
    const [language, setLanguage] = useState<any>(zhCN);
    const [authCheck, setAuthCheck] = useState<boolean>(false);

    const [messageApi, contextHolder] = message.useMessage();

    const dispatch = useDispatch();

    const userLanguage = useSelector((state: any) => state.userLanguage.value)
    const sysColor = useSelector((state: any) => state.sysColor.value)
    const isLogin = useSelector((state: any) => state.isLogin.value)
    const userType = useSelector((state: any) => state.userType.value)

    const key = 'checkUser';

    useLayoutEffect(() => {
        getBrowserInfo()
        getSysColorSetting()
        getSysSetting()
        getThemeToken()
        getSysVersion()
        getToken()
    }, [])

    useEffect(() => {
        changeLanguage(userLanguage)
    }, [userLanguage])

    // 当 themeColor 为 sys 时，根据系统颜色设置主题颜色
    useEffect(() => {
        changeThemeColor()
    }, [sysColor])

    const getSysColorSetting = () => {
        // 如果在 localStrong 中有颜色设置就使用 localStrong 中的颜色设置
        const sysColor = LStorage.get('cshbxy-oa-sysColor');
        switch (sysColor) {
            case 'light':
                dispatch(lightTheme());
                break;
            case 'dark':
                dispatch(darkTheme());
                break;
            case 'sys':
                dispatch(sysTheme());
                break;
        }
    }

    const getSysVersion = () => {
        // 从服务器获取版本号和最低支持版本号，如果版本号低于最低支持版本号，就提示用户升级系统后才能使用
        getVersion().then(res => {
            dispatch(setVersion(res.body))
        })
        getLowVersion().then(res => {
            dispatch(setLowVersion(res.body))
            if (version < res.body) {
                rootNavigate('/103');
            }
        })
    }

    const getSysSetting = () => {
        // 从 Cookie 获取语言设置，用于刷新页面上展示的语言
        Cookie.get('cshbxy-oa-language') === "en_US" ? dispatch(English()) : dispatch(Chinese())
        // 从 LocalStrong 中获取菜单模式，用于刷新页面上展示的菜单模式
        LStorage.get('cshbxy-oa-menuMode') === 'vertical' ? dispatch(vertical()) : dispatch(inline())
    }

    const getThemeToken = () => {
        // 从 LocalStrong 中获取主题颜色，用于页面整体自定义主题，如果没有就使用默认主题
        const userThemeToken = LStorage.get('cshbxy-oa-userToken')
        if (userThemeToken) {
            dispatch(setToken({
                colorPrimary: userThemeToken.colorPrimary,
                borderRadius: userThemeToken.borderRadius,
                // 错误颜色暂不支持自定义
                colorError: '#f32401'
            }))
        }
    }

    const getToken = () => {
        // 从 Cookie 中获取 token，如果获取到就向后端发送请求验证 token 是否有效，如果有效就继续，否之跳转用户登录页面
        const token = Cookie.get('cshbxy-oa-token');
        if (token) {
            messageApi.open({
                key,
                type: 'loading',
                content: intl.get('checkUser'),
            });
            checkUserInfo();
        }
    }

    const changeLanguage = (lang = "Chinese") => {
        // 默认语言为中文，同时支持英文
        intl.init({
            currentLocale: lang,
            locales,
        }).then(() => {
            setLanguage(lang === 'English' ? enUS : zhCN)
        })
    }

    const changeThemeColor = () => {
        // 获取用户设置的系统主题，如果用户设置的系统主题为 sys，就根据系统主题设置主题颜色
        switch (sysColor) {
            case 'sys':
                // 获取当前系统主题
                const themeColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                dispatch(themeColor === 'dark' ? dark() : light());
                // 监听系统主题变化
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                    dispatch(e.matches ? dark() : light());
                })
                break;
            case 'light':
                dispatch(light());
                break;
            case 'dark':
                dispatch(dark());
                break;
        }
    }

    // 校验用户
    const checkUserInfo = () => {
        checkUser().then(res => {
            // 如果校验失败，则提示用户 token 失效，跳转到登录页面
            if (res.code !== 200) {
                message.error(res.msg)
                messageApi.open({
                    key,
                    type: 'error',
                    content: intl.get('checkUserFailed'),
                    duration: 3,
                });
                rootNavigate('/login')
                return
            }
            messageApi.open({
                key,
                type: 'success',
                content: intl.get('checkUserSuccess'),
                duration: 3,
            });
            dispatch(setUser(res.body))
            dispatch(login())
            switch (res.body.userType) {
                case 'Employee':
                    dispatch(Employee())
                    break
                case 'Department':
                    dispatch(Department())
                    break
                case 'Leader':
                    dispatch(Leader())
                    break
            }
        }).catch(() => {
            messageApi.open({
                key,
                type: 'error',
                content: intl.get('checkUserFailed'),
                duration: 3,
            })
            rootNavigate('/login')
        }).finally(() => {
            setAuthCheck(true)
        })
    }

    // 路由跳转鉴权
    const onRouteBefore = ({pathname, meta}: any) => {
        if (meta.title) {
            // 设置页面标题，如果中文标题不存在，就直接使用英文标题代替，否之就判断当前用户语言，根据用户语言判断是使用中文标题还是英文标题
            if (meta.titleCN === undefined) {
                document.title = meta.title
            } else {
                userLanguage === 'English' ? document.title = meta.title : document.title = meta.titleCN
            }
        }
        if (meta.Auth) {
            // 用户鉴权，如果用户 token 未校验或者校验中，暂时不可以跳转任何需要权限的页面
            if (!authCheck)
                return
            if (userType === meta.Auth)
                return pathname
            if (!isLogin) {
                messageApi.warning(intl.get('pleaseLogin'))
                return '/login'
            }
            return '/403'
        }
        return pathname
    }

    return (
        <>
            {contextHolder}
            <ConfigProvider locale={language}>
                {/*// @ts-ignore*/}
                <HistoryRouter basename={process.env.PUBLIC_URL} history={history}>
                    <ChangeSystem/>
                    <RouterWaiter routes={routes} loading={<Spin/>} onRouteBefore={onRouteBefore}/>
                </HistoryRouter>
            </ConfigProvider>
        </>
    );
}
