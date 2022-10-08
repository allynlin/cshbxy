import React from "react";
import {version} from "../../baseInfo";
import {useSelector} from "react-redux";
import {Layout} from "antd";
import {yellow} from "../../baseInfo";
import RenderRefresh from "./RenderRefresh";

export default function RenderGetServerVersion() {

    const serverVersion = useSelector((state: {
        serverVersion: {
            value: string
        }
    }) => state.serverVersion.value);

    return (
        <Layout.Footer style={{
            backgroundColor: serverVersion > version ? yellow : "",
        }}>
            校园 OA 系统 &copy; 2022 Created by allynlin Version：{version} Server：{serverVersion} <RenderRefresh/>
        </Layout.Footer>
    );
}