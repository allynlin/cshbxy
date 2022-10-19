import {Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import RenderMenu from "./RenderMenu";
import RenderBreadcrumb from "./RenderBreadcrumb";
import RenderLogOut from "./RenderLogOut";
import RenderFooter from "./RenderFooter";
import RenderGetServerVersion from "../../component/Version/RenderGetServerVersion";
import './playOut-light.scss'
import './playOut-dark.scss'
import logo from './logo.png'
import {Outlet, useNavigate} from 'react-router-dom';
import {useSelector} from "react-redux";
import {version} from "../../baseInfo";

const {Title} = Typography;

const Home = () => {

    const navigate = useNavigate();

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

    useEffect(() => {
        if (serverVersion === "0.0.0") {
            return;
        }
        if (version < serverVersion) {
            navigate('/103')
        }
    }, [serverVersion])

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
                        <Title level={4}>{isEnglish ? 'OA System' : '校园 OA 系统'}</Title>
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
