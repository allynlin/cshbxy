import React, {useEffect, useState} from "react";
import intl from 'react-intl-universal';
import {BrowserRouter} from 'react-router-dom'
import RouterWaiter from "react-router-waiter"
import {useDispatch, useSelector} from "react-redux";
import {App as AntdApp, ConfigProvider} from "antd";

import Spin from "./component/LoadingSkleton";
import {dark, light} from "./component/redux/themeSlice";
import ChangeSystem from "./component/ChangeSystem";

import enUS from "antd/es/locale/en_US";
import zhCN from "antd/es/locale/zh_CN";

import routes from "./Router/routes";
import {getBrowserInfo} from "./checkBrowser";

// 导入自定义语言包
const locales = {
    'English': require('./component/Language/en-US.json'),
    'Chinese': require('./component/Language/zh-CN.json')
}

const MyApp = () => {
    const [language, setLanguage] = useState<any>(zhCN);

    const {message} = AntdApp.useApp();

    const dispatch = useDispatch();

    const userLanguage = useSelector((state: any) => state.userLanguage.value)
    const sysColor = useSelector((state: any) => state.sysColor.value)
    const isLogin = useSelector((state: any) => state.isLogin.value)
    const userType = useSelector((state: any) => state.userType.value)
    const isShowFloatButton = useSelector((state: any) => state.isShowFloatButton.value);

    useEffect(() => {
        getBrowserInfo();
    }, [])


    useEffect(() => {
        changeLanguage(userLanguage)
    }, [userLanguage])

    // 当 themeColor 为 sys 时，根据系统颜色设置主题颜色
    useEffect(() => {
        changeThemeColor()
    }, [sysColor])

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
            if (userType === meta.Auth)
                return pathname
            if (!isLogin) {
                message.warning(intl.get('pleaseLogin'))
                return '/login'
            }
            return '/403'
        }
        return pathname
    }

    return (
        <ConfigProvider locale={language}>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                {isShowFloatButton ? <ChangeSystem/> : null}
                <RouterWaiter routes={routes} loading={<Spin/>} onRouteBefore={onRouteBefore}/>
            </BrowserRouter>
        </ConfigProvider>
    );
}

const App = () => {
    return (
        <AntdApp>
            <MyApp/>
        </AntdApp>
    )
}

export default App;
