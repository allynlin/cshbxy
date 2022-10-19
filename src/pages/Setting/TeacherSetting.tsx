import {Button, Col, Descriptions, Divider, message, PageHeader, Row, Tag} from 'antd';
import React, {useEffect, useState} from 'react';
import {blue, red, yellow} from "../../baseInfo";
import MenuModeSetting from "./MenuModeSetting";
import ThemeSetting from "./ThemeSetting";
import UserInfo from "./UserInfo";
import LanguageSetting from "./LanguageSetting";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {inline} from "../../component/redux/menuModeSlice";
import {lightTheme} from "../../component/redux/sysColorSlice";
import {LStorage} from "../../component/localStrong";
import {English} from "../../component/redux/userLanguageSlice";

const TeacherSetting = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isEnglish, setIsEnglish] = useState(true);

    const userLanguage: String = useSelector((state: {
        userLanguage: {
            value: 'Chinese' | 'English'
        }
    }) => state.userLanguage.value)

    useEffect(() => {
        setIsEnglish(userLanguage === 'English')
    }, [userLanguage])

    // 监听 Ctrl + S 保存
    const handleKeyDown = (e: any) => {
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            message.success(isEnglish ? 'Settings saved' : '已自动保存，无需手动保存');
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
        message.success(isEnglish ? 'Reset success' : '已重置为默认设置');
        dispatch(inline());
        dispatch(lightTheme());
        dispatch(English());
        LStorage.set('menuMode', 'inline');
        LStorage.set('themeColor', 'light');
        LStorage.set('userLanguage', 'English');
    }

    return (
        <PageHeader
            onBack={() => navigate(-1)}
            title={isEnglish ? 'Setting' : "设置"}
            tags={<Tag color={yellow}>{isEnglish ? 'Attention' : '注意'}</Tag>}
            subTitle={isEnglish ? 'Effective only on this computer' : "设置项仅对此电脑有效"}
            extra={[
                <Button
                    key="2"
                    style={{
                        backgroundColor: red,
                        color: '#ffffff',
                        borderColor: red
                    }}
                    onClick={resertSetting}
                >{isEnglish ? 'Reset' : '重置'}</Button>,
                <Button key="1" type="primary"
                        onClick={() => message.success(isEnglish ? 'Settings saved' : "已自动保存，无需手动保存")}>
                    {isEnglish ? 'Save' : '保存'}
                </Button>,
            ]}
        >
            <UserInfo/>
            <Divider style={{
                color: blue
            }}>{isEnglish ? 'Setting item' : '设置项'}</Divider>
            <Row gutter={16} style={{
                borderRadius: '6px',
                backgroundColor: '#ecf3f9',
                padding: '16px'
            }}>
                <Col className="gutter-row" span={8}>
                    <Divider orientation="left">{isEnglish ? 'Menu Mode' : '菜单样式'}</Divider>
                    <MenuModeSetting/>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Divider orientation="left">{isEnglish ? 'Theme color' : '主题颜色'}</Divider>
                    <ThemeSetting/>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Divider orientation="left">{isEnglish ? 'Language setting' : '语言设置'}</Divider>
                    <LanguageSetting/>
                </Col>
            </Row>
        </PageHeader>
    )
};

export default TeacherSetting;
