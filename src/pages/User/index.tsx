import React, {useEffect} from "react";
import {Button, Layout} from 'antd';
import './index-light.scss'
import {Outlet, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {version, yellow} from "../../baseInfo";
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

    useEffect(() => {
        if (serverVersion === "0.0.0") {
            return;
        }
        if (version < serverVersion) {
            navigate('/103')
        }
    }, [serverVersion])

    const dispatch = useDispatch();


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
