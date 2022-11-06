import {Button, Col, Divider, message, PageHeader, Row, Tag} from 'antd';
import React, {useEffect} from 'react';
import {blue, red, yellow} from "../../baseInfo";
import MenuModeSetting from "./MenuModeSetting";
import ThemeSetting from "./ThemeSetting";
import LanguageSetting from "./LanguageSetting";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {inline} from "../../component/redux/menuModeSlice";
import {sysTheme} from "../../component/redux/sysColorSlice";
import {LStorage} from "../../component/localStrong";
import {English} from "../../component/redux/userLanguageSlice";
import intl from "react-intl-universal";

const Setting = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const themeColor = useSelector((state: {
        themeColor: {
            value: 'light' | 'dark'
        }
    }) => state.themeColor.value)

    const backColor = themeColor === 'light' ? 'rgba(236, 243, 249, 1)' : 'rgba(236, 243, 249, 0.4)'

    // 监听 Ctrl + S 保存
    const handleKeyDown = (e: any) => {
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            message.success(intl.get('SaveMessage'));
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
        message.success(intl.get('ResetMessage'));
        dispatch(inline());
        dispatch(sysTheme());
        dispatch(English());
        LStorage.set('menuMode', 'inline');
        LStorage.set('themeColor', 'sys');
        LStorage.set('userLanguage', 'English');
    }

    return (
        <PageHeader
            onBack={() => navigate(-1)}
            title={intl.get('Setting')}
            tags={<Tag color={yellow}>{intl.get('Attention')}</Tag>}
            subTitle={intl.get('Setting-Scope')}
            extra={[
                <Button
                    key="2"
                    style={{
                        backgroundColor: red,
                        color: '#ffffff',
                        borderColor: red
                    }}
                    onClick={resertSetting}
                >{intl.get('Reset')}</Button>,
                <Button key="1" type="primary"
                        onClick={() => message.success(intl.get('SaveMessage'))}>
                    {intl.get('Save')}
                </Button>,
            ]}
        >
            <Divider style={{
                color: blue
            }}>{'基础设置项'}</Divider>
            <Row gutter={16} style={{
                borderRadius: '6px',
                backgroundColor: backColor,
                padding: '16px'
            }}>
                <Col className="gutter-row" span={8}>
                    <Divider orientation="left">{intl.get('Menu-Mode')}</Divider>
                    <MenuModeSetting/>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Divider orientation="left">{intl.get('Theme-Color')}</Divider>
                    <ThemeSetting/>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Divider orientation="left">{intl.get('Language-Setting')}</Divider>
                    <LanguageSetting/>
                </Col>
            </Row>
        </PageHeader>
    )
};

export default Setting;
