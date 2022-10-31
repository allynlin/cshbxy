import React, {useEffect, useState} from "react";
import './App.scss';
import routes from "./Router/routes";
import RouterWaiter from "react-router-waiter"
import Spin from "./component/loading/Spin";
import {useDispatch, useSelector} from "react-redux";
import {ConfigProvider, message} from "antd";
import Cookie from "js-cookie";
import {checkDepartmentToken, checkLeaderToken, checkTeacherToken, getVersion} from "./component/axios/api";
import {login} from "./component/redux/isLoginSlice";
import {department, leader, teacher} from "./component/redux/userTypeSlice";
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

const locals = {
    'English': require('./component/Language/en-US.json'),
    'Chinese': require('./component/Language/zh-CN.json')
}

const history = createBrowserHistory({window});

export const rootNavigate = (to: string) => {
    history.push(`${process.env.PUBLIC_URL}${to}`)
};


export default function App() {
    const [isRender, setIsRender] = useState(false);
    const [prefix, setPrefix] = useState("custom-light");

    const themeColor = useSelector((state: {
        themeColor: {
            value: 'light' | 'dark'
        }
    }) => state.themeColor.value)

    useEffect(() => {
        switch (themeColor) {
            case 'dark':
                setPrefix('custom-dark')
                break;
            case 'light':
                setPrefix('custom-light')
                break;
            default:
                setPrefix('custom-light')
        }
    }, [themeColor])

    const dispatch = useDispatch();

    const userLanguage = useSelector((state: {
        userLanguage: {
            value: 'Chinese' | 'English'
        }
    }) => state.userLanguage.value)

    useEffect(() => {
        document.title = intl.get('SysName');
        intl.init({
            currentLocale: userLanguage,
            locales: locals
        })
    }, [userLanguage])

    useEffect(() => {
        LStorage.get('userLanguage') === 'English' ? dispatch(English()) : dispatch(Chinese());
        LStorage.get('menuMode') === 'inline' ? dispatch(inline()) : dispatch(vertical())
        // 如果在 localStrong 中有颜色设置就使用 localStrong 中的颜色设置
        const sysColor = LStorage.get('themeColor');
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
                dispatch(lightTheme());
        }
    }, [])

    const sysColor = useSelector((state: {
        sysColor: {
            value: 'light' | 'dark' | 'sys'
        }
    }) => state.sysColor.value)

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

    const isLogin = useSelector((state: {
        isLogin: {
            value: boolean
        }
    }) => state.isLogin.value)

    const userType: String = useSelector((state: {
        userType: {
            value: String
        }
    }) => state.userType.value)

    // 页面渲染的时候，检查 cookie 中是否有 token，如果有 token，就校验 token 是否有效，如果有效可以继续执行，如果无效，就跳转到登录页面
    useEffect(() => {
        getVersion().then(res => {
            dispatch(setVersion(res.body))
        })
        switch (Cookie.get('userType')) {
            case 'teacher':
                checkTeacher()
                break
            case 'department':
                checkDepartment()
                break
            case 'leader':
                checkLeader()
                break
            default:
                checkError()
                break
        }
    }, [])

    // 检查登录状态
    const checkTeacher = () => {
        checkTeacherToken().then(res => {
            if (res.code === 200) {
                dispatch(login())
                dispatch(teacher())
                setIsRender(true)
            } else {
                message.error(res.msg)
            }
        })
    }
    const checkDepartment = () => {
        checkDepartmentToken().then(res => {
            if (res.code === 200) {
                message.success(res.msg)
                dispatch(login())
                dispatch(department())
                setIsRender(true)
            } else {
                message.error(res.msg)
            }
        })
    }
    const checkLeader = () => {
        checkLeaderToken().then(res => {
            if (res.code === 200) {
                message.success(res.msg)
                dispatch(login())
                dispatch(leader())
                setIsRender(true)
            } else {
                message.error(res.msg)
            }
        })
    }
    const checkError = () => {
        setIsRender(true)
    }

    // 路由跳转鉴权
    const onRouteBefore = ({pathname, meta}: any) => {
        if (!isRender) return false
        if (meta.title) {
            if (meta.titleCN === undefined) {
                document.title = meta.title
            }
            userLanguage === 'English' ? document.title = meta.title : document.title = meta.titleCN
        }
        if (meta.Auth === 'public')
            return pathname
        if (userType === meta.Auth)
            return pathname
        if (!isLogin) {
            message.warning(intl.get('Please-Login'))
            return '/login'
        }
        return '/403'
    }

    return (
        <ConfigProvider locale={userLanguage === 'English' ? enUS : zhCN}>
            <HistoryRouter basename={process.env.PUBLIC_URL} history={history}>
                <RouterWaiter routes={routes} loading={<Spin/>} onRouteBefore={onRouteBefore}/>
            </HistoryRouter>
        </ConfigProvider>
    );
}
