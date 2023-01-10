import React, {useEffect, useState} from 'react';
import {Layout, theme, Typography} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {Outlet} from "react-router-dom";
import {setTableSize} from "../../component/redux/tableSizeSlice";
import {useStyles} from "../../styles/webStyle";
import {LStorage} from "../../component/localStrong";

const {Header, Content, Footer, Sider} = Layout;
const {Title, Paragraph} = Typography;

interface IProps {
    copy: React.ReactNode,
    menu: React.ReactNode,
    logOut: React.ReactNode,
    title: string,
    headMenu: React.ReactNode
}

const WebComponent: React.FC<IProps> = (props) => {

    const classes = useStyles();

    const dispatch = useDispatch();

    const userLanguage = useSelector((state: any) => state.userLanguage.value);

    const [collapsed, setCollapsed] = useState(LStorage.get('collapsed'));
    // 内容区的宽度和高度
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        // 获取页面宽度
        const width = document.body.clientWidth;
        // 获取页面高度
        const height = document.body.clientHeight;
        // 内容区域宽度计算：页面宽度 - 左侧导航栏宽度（200/80）- padding（40）
        const contentWidth = collapsed ? width - 80 - 40 : width - 200 - 40;
        // 内容区域高度计算：页面高度 - 页面顶部（54） - 页面底部（40） - padding（65）
        const contentHeight = height - 54 - 40 - 71;
        // 虚拟列表的宽度计算：页面宽度 - 左侧导航栏宽度（200）- 右侧边距（20） - 表格左右边距（20）
        const tableWidth = collapsed ? width - 80 - 40 : width - 200 - 40;
        // 虚拟列表高度计算：页面高度 - 页面顶部（54） - 页面底部（40） - padding（65）
        const tableHeight = height - 54 - 40 - 230;
        const wait = setTimeout(() => {
            dispatch(setTableSize({tableWidth, tableHeight}));
            setWidth(contentWidth);
            setHeight(contentHeight);
        }, 16)
        return () => {
            clearTimeout(wait)
        }
    }, [collapsed, userLanguage]);

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (
        <Layout>
            <Header className={classes.webHeader} style={{background: colorBgContainer}}>
                <Paragraph ellipsis>
                    <Title level={3} className={classes.headerTit}>{props.title}</Title>
                </Paragraph>
                <div>
                    {props.headMenu}
                </div>
                {props.logOut}
            </Header>
            <Layout>
                <Sider
                    collapsible
                    collapsed={collapsed}
                    theme={'light'}
                    onCollapse={(value) => {
                        setCollapsed(value)
                        LStorage.set('collapsed', value)
                    }}>
                    {props.menu}
                </Sider>
                <Layout style={{padding: '0 24px'}}>
                    <Content
                        className={classes.webLayoutContent}
                        style={{
                            background: colorBgContainer,
                            width: width,
                            height: height,
                        }}
                    >
                        <Outlet/>
                    </Content>
                    <Footer className={classes.webLayoutFooter}>
                        <Paragraph ellipsis>
                            {props.copy}
                        </Paragraph>
                    </Footer>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default WebComponent;
