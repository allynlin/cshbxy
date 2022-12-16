import {Typography, Space, Alert} from 'antd';
import React from 'react';
import MenuModeSetting from "./MenuModeSetting";
import ThemeSetting from "./ThemeSetting";
import LanguageSetting from "./LanguageSetting";
import intl from "react-intl-universal";
import UserPasswordSetting from "./UserPasswordSetting";
import UserInfoSetting from "./UserInfoSetting";
import UsernameSetting from "./UsernameSetting";
import TokenSetting from "./TokenSetting";

const {Title, Text} = Typography;

const Setting = () => (
    <Typography>
        <Alert
            message={intl.get('attention') + ': ' + intl.get('settingScopesNotice')}
            type="info"
            showIcon
            style={{marginBottom: 16}}
        />
        <Space size={"large"} align={"start"}>
            <div>
                <Title level={3}>{intl.get('userSetting')}</Title>
                <Space size={"middle"} align={"center"}>
                    <UserPasswordSetting/>
                    <UserInfoSetting/>
                    <UsernameSetting/>
                </Space>
                <Title level={3}>{intl.get('baseSetting')}</Title>
                <br/>
                <Space size={"middle"} align={"center"}>
                    <Text>{intl.get('menuMode')}</Text>
                    <MenuModeSetting/>
                </Space>
                <br/><br/>
                <Space size={"middle"} align={"center"}>
                    <Text>{intl.get('themeMode')}</Text>
                    <ThemeSetting/>
                </Space>
                <br/><br/>
                <Space size={"middle"} align={"center"}>
                    <Text>{intl.get('language')}</Text>
                    <LanguageSetting/>
                </Space>
            </div>
            <TokenSetting/>
        </Space>
    </Typography>
)

export default Setting;
