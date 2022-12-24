import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Button, message} from "antd";
import intl from "react-intl-universal";

import {version} from "../baseInfo";
import {getLowVersion, getVersion} from "./axios/api";
import {setVersion} from "./redux/serverVersionSlice";
import {setLowVersion} from "./redux/serverLowVersionSlice";


export default function RenderRefreshButton() {

    const navigate = useNavigate()

    const dispatch = useDispatch();

    const serverVersion = useSelector((state: any) => state.serverVersion.value);
    const userToken = useSelector((state: any) => state.userToken.value)

    const getVer = () => {
        getLowVersion().then(res => {
            dispatch(setLowVersion(res.body))
            if (res.body > version) {
                message.error(intl.get('notSupportVersionNotice'))
                navigate('/103')
            } else {
                getVersion().then(res => {
                    // 对比本地 version，如果本地版本低于服务器版本，就提示更新
                    if (res.body > version) {
                        message.warning(intl.get('lowVersionNotice'))
                    }
                    if (res.body === serverVersion) {
                        message.success(intl.get('versionLast'))
                    } else {
                        message.success(intl.get('updateVersionSuccess'))
                    }
                    dispatch(setVersion(res.body))
                })
            }
        })
    }

    return (
        <Button
            style={{
                backgroundColor: userToken.colorError,
                borderColor: userToken.colorError,
                color: '#ffffff'
            }}
            onClick={e => {
                e.preventDefault();
                getVer();
            }}>{intl.get('refresh')}</Button>
    );
}
