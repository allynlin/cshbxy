import React from 'react';
import {Layout, theme, Typography} from 'antd';
import {Outlet} from "react-router-dom";
import {useStyles} from "./style";

const {Header, Content, Footer, Sider} = Layout;
const {Title, Paragraph} = Typography;

interface IProps {
    menu: React.ReactNode,
    logOut: React.ReactNode,
    title: string,
}

const WebComponent: React.FC<IProps> = (props) => {

    const classes = useStyles();

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (
        <Layout>
            <Header className={classes.webHeader} style={{background: colorBgContainer}}>
                <Paragraph ellipsis>
                    <Title level={3} className={classes.headerTit}>{props.title}</Title>
                </Paragraph>
                {props.logOut}
            </Header>
            <Layout>
                <Sider
                    theme={'light'}>
                    {props.menu}
                </Sider>
                <Layout style={{padding: '0 24px'}}>
                    <Content
                        className={classes.webLayoutContent}
                        style={{
                            background: colorBgContainer,
                        }}
                    >
                        <Outlet/>
                    </Content>
                    <Footer className={classes.webLayoutFooter}>
                        长沙星辰软件有限公司 ©{new Date().getFullYear()} Created by allynlin
                    </Footer>
                </Layout>
            </Layout>
        </Layout>
    )
        ;
};

export default WebComponent;
