import React from "react";
import {version, yellow} from "../../baseInfo";
import {useSelector} from "react-redux";
import {Layout} from "antd";
import RenderRefresh from "./RenderRefresh";
import intl from "react-intl-universal";

export default function RenderGetServerVersion() {

    const serverVersion = useSelector((state: any) => state.serverVersion.value);

    return (
        <Layout.Footer style={{
            backgroundColor: serverVersion > version ? yellow : "",
        }}>
            {intl.get('sysName')} &copy; 2022 Created by allynlin
            Version：{version} Server：{serverVersion}&nbsp;
            <RenderRefresh/>
        </Layout.Footer>
    );
}
