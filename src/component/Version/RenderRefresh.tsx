import React, {useEffect, useState} from "react";
import {version} from "../../baseInfo";
import {useDispatch, useSelector} from "react-redux";
import {getVersion} from "../axios/api";
import {message} from "antd";
import {setVersion} from "../redux/serverVersionSlice";

export default function RenderRefresh() {

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

    const getVer = () => {
        getVersion().then(res => {
            // 对比本地 version，如果本地版本低于服务器版本，就提示更新
            if (res.body > version) {
                message.warning(isEnglish ? 'Current version is too low, please update' : '当前版本过低，请更新版本')
            } else {
                message.success(isEnglish ? 'Current version is the latest' : '当前版本为最新版本')
            }
            dispatch(setVersion(res.body))
        })
    }

    return (
        <a
            onClick={e => {
                e.preventDefault();
                getVer();
            }}>{isEnglish ? 'Refresh' : '刷新'}</a>
    );
}
