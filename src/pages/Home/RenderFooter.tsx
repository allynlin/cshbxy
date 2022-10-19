import React, {useEffect, useState} from "react";
import {version} from "../../baseInfo";
import {useDispatch, useSelector} from "react-redux";
import {getVersion} from "../../component/axios/api";
import {message} from "antd";
import {setVersion} from "../../component/redux/serverVersionSlice";
import {yellow} from "../../baseInfo";

export default function RenderFooter() {

    const dispatch = useDispatch();
    const [isEnglish, setIsEnglish] = useState(true);

    const userLanguage: String = useSelector((state: {
        userLanguage: {
            value: 'Chinese' | 'English'
        }
    }) => state.userLanguage.value)

    useEffect(() => {
        setIsEnglish(userLanguage === 'English')
    }, [userLanguage])

    const serverVersion = useSelector((state: {
        serverVersion: {
            value: string
        }
    }) => state.serverVersion.value);

    const getVer = () => {
        getVersion().then(res => {
            // 对比本地 version，如果本地版本低于服务器版本，就提示更新
            if (res.body > version) {
                message.warning("当前版本过低，请更新版本")
            }
            dispatch(setVersion(res.body))
        })
    }

    const RenderRefresh = () => {
        return (
            <a
                onClick={e => {
                    e.preventDefault();
                    getVer();
                }}>{isEnglish ? 'Refresh' : '刷新'}</a>
        )
    }

    return (
        <div style={{
            backgroundColor: serverVersion > version ? yellow : "",
            width: "100%",
            height: "100%",
        }}>
            <span>{isEnglish ? 'College OA System' : '校园 OA 系统'} &copy; 2022 Created by allynlin Version：{version} Server：{serverVersion}&nbsp;
                <RenderRefresh/></span>
        </div>
    )
}
