import React, {useEffect, useState} from "react";
import './App.scss';
import routes from "./Router/routes";
import Cookie from 'js-cookie';
import RouterWaiter from "react-router-waiter"
import Spin from "./component/loading/Spin";
import {useDispatch, useSelector} from "react-redux";
import {ConfigProvider, message} from "antd";
import {checkUser, getLowVersion, getVersion} from "./component/axios/api";
import {login} from "./component/redux/isLoginSlice";
import {Department, Employee, Leader} from "./component/redux/userTypeSlice";
import {setVersion} from "./component/redux/serverVersionSlice";
import {unstable_HistoryRouter as HistoryRouter} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import {darkTheme, lightTheme, sysTheme} from "./component/redux/sysColorSlice";
import {dark, light} from "./component/redux/themeSlice";
import {LStorage} from "./component/localStrong";
import {inline, vertical} from "./component/redux/menuModeSlice";
import {Chinese, English} from "./component/redux/userLanguageSlice";
import enUS from "antd/es/locale/en_US";
import zhCN from "antd/es/locale/zh_CN";
import intl from 'react-intl-universal';
import {setUser} from "./component/redux/userInfoSlice";
import {setLowVersion} from "./component/redux/serverLowVersionSlice";
import ChangeSystem from "./component/ChangeSystem/ChangeSystem";
import {getBrowserInfo} from "./checkBrowser";
import {version} from "./baseInfo";
import {setToken} from "./component/redux/userTokenSlice";

const locales = {
    'English': require('./component/Language/en-US.json'),
    'Chinese': require('./component/Language/zh-CN.json')
}

const history = createBrowserHistory({window});

export const rootNavigate = (to: string) => {
    history.push(`${process.env.PUBLIC_URL}${to}`)
};


export default function App() {
    const [language, setLanguage] = useState<any>(zhCN);
    const [authCheck, setAuthCheck] = useState<boolean>(false);

    const [messageApi, contextHolder] = message.useMessage();
    const key = 'checkUser';

    const dispatch = useDispatch();

    const userLanguage = useSelector((state: any) => state.userLanguage.value)
    const sysColor = useSelector((state: any) => state.sysColor.value)

    useEffect(() => {
        changeLanguage(userLanguage)
    }, [userLanguage])

    const changeLanguage = (lang = "Chinese") => {
        intl.init({
            currentLocale: lang,
            locales,
        }).then(() => {
            setLanguage(lang === 'English' ? enUS : zhCN)
        })
    }

    useEffect(() => {
        getBrowserInfo()
        Cookie.get('cshbxy-oa-language') === "en_US" ? dispatch(English()) : dispatch(Chinese())
        LStorage.get('cshbxy-oa-menuMode') === 'vertical' ? dispatch(vertical()) : dispatch(inline())
        const userThemeToken = LStorage.get('cshbxy-oa-userToken')
        if (userThemeToken) {
            dispatch(setToken(userThemeToken))
        }
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
            default:
                dispatch(sysTheme());
        }
        // 页面渲染的时候，检查 cookie 中是否有 token，如果有 token，就校验 token 是否有效，如果有效可以继续执行，如果无效，就跳转到登录页面
        getVersion().then(res => {
            dispatch(setVersion(res.body))
        })
        getLowVersion().then(res => {
            dispatch(setLowVersion(res.body))
            if (version < res.body) {
                rootNavigate('/103');
            }
        })
        const token = Cookie.get('cshbxy-oa-token');
        if (token) {
            messageApi.open({
                key,
                type: 'loading',
                content: intl.get('checkUser'),
            });
            checkUserInfo();
        }
    }, [])

    // 当 themeColor 为 sys 时，根据系统颜色设置主题颜色
    useEffect(() => {
        switch (sysColor) {
            case 'sys':
                const themeColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                dispatch(themeColor === 'dark' ? dark() : light());
                // 监听系统颜色变化
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
    }, [sysColor])

    const isLogin = useSelector((state: any) => state.isLogin.value)
    const userType: String = useSelector((state: any) => state.userType.value)

    // 校验用户
    const checkUserInfo = () => {
        checkUser().then(res => {
            if (res.code === 200) {
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
            } else {
                message.error(res.msg)
                messageApi.open({
                    key,
                    type: 'error',
                    content: intl.get('checkUserFailed'),
                    duration: 3,
                });
                rootNavigate('/login')
            }
        }).catch(() => {
            messageApi.open({
                key,
                type: 'error',
                content: intl.get('checkUserFailed'),
                duration: 3,
            })
        }).finally(() => {
            setAuthCheck(true)
        })
    }

    // 路由跳转鉴权
    const onRouteBefore = ({pathname, meta}: any) => {

        if (meta) {
            if (meta.title) {
                if (meta.titleCN === undefined) {
                    document.title = meta.title
                } else {
                    userLanguage === 'English' ? document.title = meta.title : document.title = meta.titleCN
                }
            }
            if (meta.Auth) {
                if (!authCheck)
                    return
                if (userType === meta.Auth)
                    return pathname
                if (userType === meta.Auth2)
                    return pathname
                if (!isLogin) {
                    message.warning(intl.get('pleaseLogin'))
                    return '/login'
                }
                return '/403'
            }
        }
        return pathname
    }

    return (

        <>
            {contextHolder}
            <ChangeSystem/>
            <ConfigProvider locale={language}>
                {/*// @ts-ignore*/}
                <HistoryRouter basename={process.env.PUBLIC_URL} history={history}>
                    <RouterWaiter routes={routes} loading={<Spin/>} onRouteBefore={onRouteBefore}/>
                </HistoryRouter>
            </ConfigProvider>
        </>
    );
}
