import React, {useEffect, useState} from "react";
import {version, yellow} from "../../baseInfo";
import {useSelector} from "react-redux";
import RenderRefresh from "./RenderRefresh";
import intl from "react-intl-universal";

export default function RenderGetServerVersion() {

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
            <span>{intl.get('SysName')} &copy; 2022 Created by allynlin Version：{version} Server：{serverVersion}&nbsp;
                <RenderRefresh/></span>
        </div>
    )
}
