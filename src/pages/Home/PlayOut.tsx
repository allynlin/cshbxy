import {Typography} from 'antd';
import React from 'react';
import RenderMenu from "./RenderMenu";
import RenderBreadcrumb from "./RenderBreadcrumb";
import RenderLogOut from "./RenderLogOut";
import './index.scss'
import logo from './logo.png'
import {Outlet} from 'react-router-dom';
import {version} from "../../baseInfo";
import {useSelector} from "react-redux";

const {Title} = Typography;

const Home = () => {
    const serverVersion = useSelector((state: {
        serverVersion: {
            value: string
        }
    }) => state.serverVersion.value);
    return (
        <div className={'home-body'}>
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