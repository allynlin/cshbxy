import React, {useEffect, useState} from 'react';
import {Layout, theme, Typography} from 'antd';
import {Outlet} from "react-router-dom";
import RenderMenu from "./RenderMenu";
import {version} from "../../baseInfo";
import {useDispatch, useSelector} from "react-redux";
import RenderLogOut from "./RenderLogOut";
import './web.scss';
import {setTableSize} from "../../component/redux/tableSizeSlice";

const {Header, Content, Footer, Sider} = Layout;
const {Title} = Typography;

const App: React.FC = () => {

    const [collapsed, setCollapsed] = useState(false);
    const [title, setTitle] = useState('')

    const dispatch = useDispatch();

    const serverVersion = useSelector((state: any) => state.serverVersion.value);
    const userLanguage = useSelector((state: any) => state.userLanguage.value);

    // 内容区的宽度和高度
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        setTitle(userLanguage === "Chinese" ? "长沙星辰软件有限公司 OA 系统" : "长沙星辰软件有限公司 OA System")
        // 获取页面宽度
        const width = document.body.clientWidth;
        // 获取页面高度
        const height = document.body.clientHeight;
        // 内容区域宽度计算：页面宽度 - 左侧导航栏宽度（200/80）- padding（40）
        const contentWidth = collapsed ? width - 80 - 40 : width - 200 - 40;
        // 内容区域高度计算：页面高度 - 页面顶部（54） - 页面底部（40） - padding（65）
        const contentHeight = height - 54 - 40 - 65;
        // 虚拟列表的宽度计算：页面宽度 - 左侧导航栏宽度（200）- 右侧边距（20） - 表格左右边距（20）
        const tableWidth = collapsed ? width - 80 - 40 : width - 200 - 40;
        // 虚拟列表高度计算：页面高度 - 页面顶部（54） - 页面底部（40） - padding（65）
        const tableHeight = height - 54 - 40 - 220;
        const wait = setTimeout(() => {
            dispatch(setTableSize({tableWidth, tableHeight}));
            setWidth(contentWidth);
            setHeight(contentHeight);
        }, 500)
        return () => {
            clearTimeout(wait)
        }
    }, [collapsed, userLanguage]);

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (
        <Layout>
            <Header className="header" style={{background: colorBgContainer}}>
                <Title level={3} className={'tit'}>{title}</Title>
                <RenderLogOut/>
            </Header>
            <Layout>
                <Sider
                    collapsible
                    collapsed={collapsed}
                    theme={'light'}
                    onCollapse={(value) => setCollapsed(value)}>
                    <RenderMenu/>
                </Sider>
                <Layout style={{padding: '0 24px 24px'}}>
                    <Content
                        className={'layout-content'}
                        style={{
                            background: colorBgContainer,
                            width: width,
                            height: height,
                        }}
                    >
                        <Outlet/>
                    </Content>
                    <Footer style={{textAlign: 'center', margin: 0, padding: 16}}>长沙星辰软件有限公司
                        OA &copy; 2022-2023 Created by
                        allynlin
                        Version：{version} Server：{serverVersion}</Footer>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default App;
