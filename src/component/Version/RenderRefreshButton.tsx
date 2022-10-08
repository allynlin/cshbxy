import React from "react";
import {version} from "../../baseInfo";
import {useDispatch} from "react-redux";
import {getVersion} from "../axios/api";
import {Button, message} from "antd";
import {setVersion} from "../redux/serverVersionSlice";
import {red} from "../../baseInfo";

export default function RenderRefreshButton() {

    const dispatch = useDispatch();

    const getVer = () => {
        getVersion().then(res => {
            // 对比本地 version，如果本地版本低于服务器版本，就提示更新
            if (res.body > version) {
                message.warning("当前版本过低，请更新版本")
            } else {
                message.success(`当前版本已是最新版本`)
                message.success(`当前页面如果未自动跳转，请点击下方返回按钮`)
            }
            dispatch(setVersion(res.body))
        })
    }

    return (
        <Button
            style={{
                backgroundColor: red,
                borderColor: red,
                color: '#ffffff'
            }}
            onClick={e => {
                e.preventDefault();
                getVer();
            }}>重新获取服务器版本</Button>
    );
}