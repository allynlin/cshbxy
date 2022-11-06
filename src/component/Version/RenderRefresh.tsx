import React from "react";
import {version} from "../../baseInfo";
import {useDispatch, useSelector} from "react-redux";
import {getLowVersion, getVersion} from "../axios/api";
import {message} from "antd";
import {setVersion} from "../redux/serverVersionSlice";
import intl from "react-intl-universal";
import {setLowVersion} from "../redux/serverLowVersionSlice";
import {useNavigate} from "react-router-dom";

export default function RenderRefresh() {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const serverVersion = useSelector((state: any) => state.serverVersion.value);

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
        <a
            onClick={e => {
                e.preventDefault();
                getVer();
            }}>{intl.get('refresh')}</a>
    );
}
