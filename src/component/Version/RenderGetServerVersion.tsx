import React, {useEffect, useState} from "react";
import {version} from "../../baseInfo";
import {useSelector} from "react-redux";
import {yellow} from "../../baseInfo";
import RenderRefresh from "./RenderRefresh";

export default function RenderGetServerVersion() {

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
