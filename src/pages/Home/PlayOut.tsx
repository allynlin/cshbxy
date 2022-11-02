import {message, Typography} from 'antd';
import React, {useEffect} from 'react';
import RenderMenu from "./RenderMenu";
import RenderBreadcrumb from "./RenderBreadcrumb";
import RenderLogOut from "./RenderLogOut";
import RenderGetServerVersion from "../../component/Version/RenderGetServerVersion";
import './playOut-light.scss'
import './playOut-dark.scss'
import logo from './logo.png'
import {Outlet, useNavigate} from 'react-router-dom';
import {useSelector} from "react-redux";
import {version} from "../../baseInfo";
import intl from "react-intl-universal";

const {Title} = Typography;

const Home = () => {

    const navigate = useNavigate();

    const serverVersion = useSelector((state: {
        serverVersion: {
            value: string
        }
    }) => state.serverVersion.value);

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

    const themeColor: String = useSelector((state: {
        themeColor: {
            value: String
        }
    }) => state.themeColor.value)

    // 根据不同的 themeColor，渲染不同的样式
    const renderThemeColor = () => {
        switch (themeColor) {
            case 'dark':
                return 'home-body-dark'
            case 'light':
                return 'home-body-light'
            default:
                return 'home-body-light'
        }
    }

    return (
        <div className={renderThemeColor()}>
            <div className={'home-left'}>
                <div className={'silder'}>
                    <div className={'top'}>
                        <div className={'logo'}>
                            <img src={logo} width={'20px'} height={'20px'} alt={'logo'}/>
                        </div>
                        <Title level={4}>{intl.get('SysName')}</Title>
                    </div>
                    <div className={'silder_content'}>
                        <RenderMenu/>
                    </div>
                    <div className={'bottom'}></div>
                </div>
            </div>
            <div className={'home-right'}>
                <div className={'header'}>
                    <span><RenderBreadcrumb/></span>
                    <span className={'right'}><RenderLogOut/></span>
                </div>
                <div className={'content'}>
                    <Outlet/>
                </div>
                <div className={'footer'}>
                    <RenderGetServerVersion/>
                </div>
            </div>
        </div>
    )
}

export default Home;
