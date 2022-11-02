import React from "react";
import {version} from "../../baseInfo";
import {useDispatch} from "react-redux";
import {getLowVersion, getVersion} from "../axios/api";
import {message} from "antd";
import {setVersion} from "../redux/serverVersionSlice";
import intl from "react-intl-universal";
import {setLowVersion} from "../redux/serverLowVersionSlice";
import {useNavigate} from "react-router-dom";

export default function RenderRefresh() {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const getVer = () => {
        getLowVersion().then(res => {
            dispatch(setLowVersion(res.body))
            if (res.body > version) {
                message.error('您正在使用的版本低于服务器最低受支持版本，请更新后再使用')
                navigate('/103')
            } else {
                getVersion().then(res => {
                    // 对比本地 version，如果本地版本低于服务器版本，就提示更新
                    if (res.body > version) {
                        message.warning('您当前使用的版本过低，可能会导致部分功能无法使用，请及时更新')
                    } else {
                        message.success(intl.get('Version-Success'))
                    }
                    dispatch(setVersion(res.body))
                })
            }
        }).catch(err => {
            message.error(err.message)
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
