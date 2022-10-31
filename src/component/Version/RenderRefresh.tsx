import React from "react";
import {version} from "../../baseInfo";
import {useDispatch} from "react-redux";
import {getVersion} from "../axios/api";
import {message} from "antd";
import {setVersion} from "../redux/serverVersionSlice";
import intl from "react-intl-universal";

export default function RenderRefresh() {

    const dispatch = useDispatch();

    const getVer = () => {
        getVersion().then(res => {
            // 对比本地 version，如果本地版本低于服务器版本，就提示更新
            if (res.body > version) {
                message.warning(intl.get('Version-Warning'))
            } else {
                message.success(intl.get('Version-Success'))
            }
            dispatch(setVersion(res.body))
        })
    }

    return (
        <a
            onClick={e => {
                e.preventDefault();
                getVer();
            }}>{intl.get('Refresh')}</a>
    );
}
