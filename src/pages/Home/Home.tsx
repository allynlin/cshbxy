import React, {useEffect, useState} from 'react';
import {Breadcrumb, Layout, theme, Typography} from 'antd';
import {Outlet} from "react-router-dom";
import RenderMenu from "./RenderMenu";
import {version} from "../../baseInfo";
import {useSelector} from "react-redux";
import RenderBreadcrumb from "./RenderBreadcrumb";
import RenderLogOut from "./RenderLogOut";
import './home.scss';
import intl from "react-intl-universal";

const {Header, Content, Footer, Sider} = Layout;
const {Title} = Typography;

const App: React.FC = () => {

    const [collapsed, setCollapsed] = useState(false);

    // 虚拟列表的宽度和高度
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        // 获取页面宽度
        const width = document.body.clientWidth;
        // 获取页面高度
        const height = document.body.clientHeight;
        // 内容区域宽度计算：页面宽度 - 左侧导航栏宽度（200/80）- padding（40）
        const contentWidth = collapsed ? width - 80 - 40 : width - 200 - 40;
        // 内容区域高度计算：页面高度 - 页面顶部（54） - 页面底部（40） - padding（100）
        const contentHeight = height - 54 - 40 - 100;
        setWidth(contentWidth);
        setHeight(contentHeight);
    }, [collapsed]);

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const serverVersion = useSelector((state: any) => state.serverVersion.value);

    return (
        <Layout>
            <Header className="header">
                <Title level={2} className={'tit'}>{intl.get('sysName')}</Title>
                <RenderLogOut/>
            </Header>
            <Layout>
                <Sider
                    collapsible
                    collapsed={collapsed}
                    style={{background: colorBgContainer}}
                    onCollapse={(value) => setCollapsed(value)}>
                    <RenderMenu/>
                </Sider>
                <Layout style={{padding: '0 24px 24px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <RenderBreadcrumb/>
                    </Breadcrumb>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: colorBgContainer,
                            width: width,
                            height: height,
                            overflow: 'auto',
                        }}
                    >
                        <Outlet/>
                    </Content>
                    <Footer style={{textAlign: 'center', margin: 0, padding: 16}}>OA &copy; 2022 Created by allynlin
                        Version：{version} Server：{serverVersion}</Footer>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default App;
