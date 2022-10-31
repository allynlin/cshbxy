import React, {useEffect} from "react";
import {Layout} from 'antd';
import './index.scss'
import {Outlet, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {version} from "../../baseInfo";
import RenderGetServerVersionPublic from "../../component/Version/RenderGetServerVersionPublic";
import {RenderToggleLanguageButton} from "../../component/Language/RenderToggleLanguageButton";
import intl from "react-intl-universal";

const {Header, Content} = Layout;

export const User = () => {

    const navigate = useNavigate();

    const serverVersion = useSelector((state: {
        serverVersion: {
            value: string
        }
    }) => state.serverVersion.value);

    useEffect(() => {
        if (serverVersion === "0.0.0") {
            return;
        }
        if (version < serverVersion) {
            navigate('/103')
        }
    }, [serverVersion])

    return (
        <Layout>
            <Header>
                <span>{intl.get('SysName')} {version}&nbsp;<RenderToggleLanguageButton/></span>
            </Header>
            <Content>
                <Outlet/>
            </Content>
            <RenderGetServerVersionPublic/>
        </Layout>
    )
}
