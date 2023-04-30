import React, {useEffect} from "react";
import {RouterProvider} from 'react-router-dom'
import {ConfigProvider} from "antd";

import zhCN from "antd/es/locale/zh_CN";

import {getBrowserInfo} from "./checkBrowser";
import router from "./Router/route";

const MyApp = () => {

    useEffect(() => {
        getBrowserInfo();
    }, [])

    return (
        <ConfigProvider locale={zhCN}>
            <RouterProvider router={router}/>
        </ConfigProvider>
    );
}

export default MyApp;
