import {Button, Col, Descriptions, Divider, message, PageHeader, Row, Tag} from 'antd';
import React, {useEffect} from 'react';
import {blue, red, yellow} from "../../baseInfo";
import MenuModeSetting from "./MenuModeSetting";
import ThemeSetting from "./ThemeSetting";
import UserInfo from "./UserInfo";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {inline} from "../../component/redux/menuModeSlice";
import {lightTheme} from "../../component/redux/sysColorSlice";
import {LStorage} from "../../component/localStrong";

const TeacherSetting = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 监听 Ctrl + S 保存
    const handleKeyDown = (e: any) => {
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            message.success('已自动保存，无需手动保存');
        }
    }

    // 自动监听 Ctrl + S 保存
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [])

    const resertSetting = () => {
        dispatch(inline());
        dispatch(lightTheme());
        LStorage.set('menuMode', 'inline');
        LStorage.set('themeColor', 'light');
        message.success('已重置为默认设置');
    }

    return (
        <PageHeader
            onBack={() => navigate(-1)}
            title="设置"
            tags={<Tag color={yellow}>注意</Tag>}
            subTitle={"设置项仅对此电脑有效"}
            extra={[
                <Button
                    key="2"
                    style={{
                        backgroundColor: red,
                        color: '#ffffff',
                        borderColor: red
                    }}
                    onClick={resertSetting}
                >重置</Button>,
                <Button key="1" type="primary" onClick={() => message.success("已自动保存，无需手动保存")}>
                    保存
                </Button>,
            ]}
        >
            <UserInfo/>
            <Divider style={{
                color: blue
            }}>设置项</Divider>
            <Row gutter={16} style={{
                borderRadius: '6px',
                backgroundColor: '#ecf3f9',
                padding: '16px'
            }}>
                <Col className="gutter-row" span={8}>
                    <Divider orientation="left">菜单样式</Divider>
                    <MenuModeSetting/>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Divider orientation="left">主题颜色</Divider>
                    <ThemeSetting/>
                </Col>
            </Row>
        </PageHeader>
    )
};

export default TeacherSetting;