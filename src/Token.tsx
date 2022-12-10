import React from "react";
import App from "./App";
import {ConfigProvider, theme} from "antd";
import {useSelector} from "react-redux";

export default function Token() {

    const themeColor = useSelector((state: any) => state.themeColor.value)
    const userToken = useSelector((state: any) => state.userToken.value)

    return (
        <ConfigProvider
            theme={{
                token: {
                    // colorPrimary: '#ED4192'
                    colorError: '#f32401',
                    colorErrorText: '#f32401',
                    colorSuccess: '#006c01',
                    colorSuccessText: '#006c01',
                    colorWarning: '#ff8d00',
                    colorWarningText: '#ff8d00',
                    colorInfo: '#40a9ff',
                    colorInfoText: '#40a9ff',
                },
                algorithm: themeColor === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}>
            <App/>
        </ConfigProvider>
    );
}
