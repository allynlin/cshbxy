import React, {useEffect, useState} from "react";
import App from "./App";
import {ConfigProvider, theme} from "antd";
import {useSelector} from "react-redux";

export default function Token() {

    const themeColor = useSelector((state: any) => state.themeColor.value)
    const userToken = useSelector((state: any) => state.userToken.value)

    const [userThemeToken, setUserThemeToken] = useState<any>({
        colorPrimary: userToken.colorPrimary,
        borderRadius: userToken.borderRadius,
        colorError: userToken.colorError,
        colorSuccess: userToken.colorSuccess,
        colorWarning: userToken.colorWarning,
    })

    useEffect(() => {
        setUserThemeToken({
            colorPrimary: userToken.colorPrimary,
            borderRadius: userToken.borderRadius,
            colorError: userToken.colorError,
            colorSuccess: userToken.colorSuccess,
            colorWarning: userToken.colorWarning,
        })
    }, [userToken])

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: userThemeToken.colorPrimary || '#1677ff',
                    borderRadius: userThemeToken.borderRadius || 6,
                    colorError: userThemeToken.colorError || '#f32401',
                    colorSuccess: userThemeToken.colorSuccess || '#006c01',
                    colorWarning: userThemeToken.colorWarning || '#ff8d00',
                },
                algorithm: themeColor === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}>
            <App/>
        </ConfigProvider>
    );
}
