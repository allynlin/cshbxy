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
    })

    useEffect(() => {
        setUserThemeToken({
            colorPrimary: userToken.colorPrimary,
            borderRadius: userToken.borderRadius,
        })
    }, [userToken])

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: userThemeToken.colorPrimary || '#1677ff',
                    borderRadius: userThemeToken.borderRadius || 6,
                },
                algorithm: themeColor === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}>
            <App/>
        </ConfigProvider>
    );
}
