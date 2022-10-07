import {Typography} from 'antd';
import React from 'react';
import RenderMenu from "./RenderMenu";
import RenderBreadcrumb from "./RenderBreadcrumb";
import RenderLogOut from "./RenderLogOut";
import './playOut-light.scss'
import './playOut-dark.scss'
import logo from './logo.png'
import {Outlet} from 'react-router-dom';
import {version} from "../../baseInfo";
import {useSelector} from "react-redux";

const {Title} = Typography;

const Home = () => {

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

    const serverVersion = useSelector((state: {
        serverVersion: {
            value: string
        }
    }) => state.serverVersion.value);

    return (
        <div className={renderThemeColor()}>
            <div className={'home-left'}>
                <div className={'silder'}>
                    <div className={'top'}>
                        <div className={'logo'}>
                            <img src={logo} width={'20px'} height={'20px'} alt={'logo'}/>
                        </div>
                        <Title level={4}>校园 OA 系统</Title>
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
                    <span>校园 OA 系统 &copy; 2022 Created by allynlin Version：{version} Server：{serverVersion}</span>
                </div>
            </div>


        </div>
    )
}

export default Home;