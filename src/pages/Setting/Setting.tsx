import {Col, Divider, message, Row, Tag, Typography} from 'antd';
import React, {useEffect} from 'react';
import {blue, yellow} from "../../baseInfo";
import MenuModeSetting from "./MenuModeSetting";
import ThemeSetting from "./ThemeSetting";
import LanguageSetting from "./LanguageSetting";
import {useDispatch, useSelector} from "react-redux";
import {inline} from "../../component/redux/menuModeSlice";
import {sysTheme} from "../../component/redux/sysColorSlice";
import {LStorage} from "../../component/localStrong";
import {English} from "../../component/redux/userLanguageSlice";
import intl from "react-intl-universal";
import UserPasswordSetting from "./UserPasswordSetting";
import UserInfoSetting from "./UserInfoSetting";
import UsernameSetting from "./UsernameSetting";

const {Title} = Typography;

const Setting = () => {

    const dispatch = useDispatch();

    const themeColor = useSelector((state: any) => state.themeColor.value)

    const backColor = themeColor === 'light' ? 'rgba(236, 243, 249, 1)' : 'rgba(236, 243, 249, 0.4)'

    // 监听 Ctrl + S 保存
    const handleKeyDown = (e: any) => {
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            message.success(intl.get('autoSaveNotice'));
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
        message.success(intl.get('resetSuccess'));
        dispatch(inline());
        dispatch(sysTheme());
        dispatch(English());
        LStorage.set('menuMode', 'inline');
        LStorage.set('themeColor', 'sys');
        LStorage.set('userLanguage', 'English');
    }

    return (
        <div
            style={{
                padding: '20px',
            }}
        >
            <Title level={3}>{intl.get('setting')}</Title>
            <Tag color={yellow}>{intl.get('attention')}</Tag>
            <Tag>{intl.get('settingScopesNotice')}</Tag>
            <Divider style={{
                color: blue
            }}>{intl.get('userSetting')}</Divider>
            <Row gutter={16} style={{
                borderRadius: '6px',
                backgroundColor: backColor,
                padding: '16px'
            }}>
                <Col className="gutter-row" span={8}>
                    <Divider orientation="left">{intl.get('changePassword')}</Divider>
                    <UserPasswordSetting/>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Divider orientation="left">{intl.get('changeUserInfo')}</Divider>
                    <UserInfoSetting/>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Divider orientation="left">{intl.get('changeUsername')}</Divider>
                    <UsernameSetting/>
                </Col>
            </Row>
            <Divider style={{
                color: blue
            }}>{intl.get('baseSetting')}</Divider>
            <Row gutter={16} style={{
                borderRadius: '6px',
                backgroundColor: backColor,
                padding: '16px'
            }}>
                <Col className="gutter-row" span={8}>
                    <Divider orientation="left">{intl.get('menuMode')}</Divider>
                    <MenuModeSetting/>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Divider orientation="left">{intl.get('themeMode')}</Divider>
                    <ThemeSetting/>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Divider orientation="left">{intl.get('language')}</Divider>
                    <LanguageSetting/>
                </Col>
            </Row>
        </div>
    )
};

export default Setting;
