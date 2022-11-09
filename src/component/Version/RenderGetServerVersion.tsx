import React from "react";
import {red, version, yellow} from "../../baseInfo";
import {useSelector} from "react-redux";
import RenderRefresh from "./RenderRefresh";
import intl from "react-intl-universal";

export default function RenderGetServerVersion() {

    const serverVersion = useSelector((state: any) => state.serverVersion.value);

    const serverLowVersion = useSelector((state: any) => state.serverLowVersion.value);


    return (
        <div className={'bq'} style={{
            backgroundColor: serverLowVersion > version ? red : serverVersion > version ? yellow : ""
        }}>
            <span>{intl.get('sysName')} &copy; 2022 Created by allynlin Version：{version} Server：{serverVersion}&nbsp;
                <RenderRefresh/></span>
        </div>
    )
}
