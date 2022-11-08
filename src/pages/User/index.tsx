import React, {useEffect} from "react";
import {Layout, message} from 'antd';
import './index-light.scss'
import {Outlet, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {version} from "../../baseInfo";
import RenderGetServerVersionPublic from "../../component/Version/RenderGetServerVersionPublic";
import intl from "react-intl-universal";
import {RenderToggleLanguageSelect} from "../../component/Language/RenderToggleLanguageSelect";

const {Header, Content} = Layout;

export const User = () => {

    const navigate = useNavigate();

    const serverVersion = useSelector((state: any) => state.serverVersion.value);

    const themeColor: String = useSelector((state: any) => state.themeColor.value)

    const serverLowVersion = useSelector((state: { serverLowVersion: { value: string } }) => state.serverLowVersion.value);

    useEffect(() => {
        if (serverLowVersion === "0.0.0") {
            return;
        }
        if (version < serverLowVersion) {
            navigate('/103')
        }
        if (version < serverVersion) {
            message.warning(intl.get('lowVersionNotice'))
        }
    }, [serverLowVersion, serverVersion])


    return (
        <Layout className={themeColor === 'dark' ? 'user-dark' : 'user-light'}>
            <Header>
                <span>{intl.get('sysName')} &nbsp;<RenderToggleLanguageSelect/></span>
            </Header>
            <Content>
                <Outlet/>
            </Content>
            <RenderGetServerVersionPublic/>
        </Layout>
    )
}
