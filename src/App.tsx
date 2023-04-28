import React, {useEffect, useState} from "react";
import intl from 'react-intl-universal';
import {RouterProvider} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {ConfigProvider} from "antd";

import {dark, light} from "./component/redux/themeSlice";

import enUS from "antd/es/locale/en_US";
import zhCN from "antd/es/locale/zh_CN";

import {getBrowserInfo} from "./checkBrowser";
import router from "./Router/route";

// 导入自定义语言包
const locales = {
    'English': require('./component/Language/en-US.json'),
    'Chinese': require('./component/Language/zh-CN.json')
}

const MyApp = () => {
    const [language, setLanguage] = useState<any>(zhCN);

    const dispatch = useDispatch();

    const userLanguage = useSelector((state: any) => state.userLanguage.value)
    const sysColor = useSelector((state: any) => state.sysColor.value)

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

    return (
        <ConfigProvider locale={language}>
            <RouterProvider router={router}/>
        </ConfigProvider>
    );
}

export default MyApp;
