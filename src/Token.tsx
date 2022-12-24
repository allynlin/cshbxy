import React, {useEffect, useState} from "react";
import {ConfigProvider, theme} from "antd";
import {useSelector} from "react-redux";

import App from "./App";

interface token {
    colorPrimary: string,
    borderRadius: number,
    colorError: string
}

export default function Token() {

    const themeColor = useSelector((state: any) => state.themeColor.value)
    const userToken = useSelector((state: any) => state.userToken.value)

    const [userThemeToken, setUserThemeToken] = useState<token>({
        colorPrimary: userToken.colorPrimary,
        borderRadius: userToken.borderRadius,
        colorError: userToken.colorError,
    })

    useEffect(() => {
        setUserThemeToken({
            colorPrimary: userToken.colorPrimary,
            borderRadius: userToken.borderRadius,
            colorError: userToken.colorError,
        })
    }, [userToken])

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: userThemeToken.colorPrimary || '#1677ff',
                    borderRadius: userThemeToken.borderRadius || 6,
                    colorError: '#f32401'
                },
                algorithm: themeColor === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}>
            <App/>
        </ConfigProvider>
    );
}
