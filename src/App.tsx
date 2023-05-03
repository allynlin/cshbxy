import React from "react";
import {RouterProvider} from 'react-router-dom'
import {ConfigProvider} from "antd";

import zhCN from "antd/es/locale/zh_CN";

import router from "./Router/route";

const MyApp = () => {

    return (
        <ConfigProvider locale={zhCN}>
            <RouterProvider router={router}/>
        </ConfigProvider>
    );
}

export default MyApp;
