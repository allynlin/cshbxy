import React, {useEffect} from "react";
import {Layout, message} from 'antd';
import './index-light.scss'
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

    const themeColor: String = useSelector((state: {
        themeColor: {
            value: String
        }
    }) => state.themeColor.value)

    const serverLowVersion = useSelector((state: { serverLowVersion: { value: string } }) => state.serverLowVersion.value);

    useEffect(() => {
        if (serverLowVersion === "0.0.0") {
            return;
        }
        if (version < serverLowVersion) {
            navigate('/103')
        }
        if (version < serverVersion) {
            message.warning('您当前使用的版本过低，可能会导致部分功能无法使用，请及时更新')
        }
    }, [serverLowVersion, serverVersion])


    return (
        <Layout className={themeColor === 'dark' ? 'user-dark' : 'user-light'}>
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
