import {Alert, Space, Tooltip, Typography} from 'antd';
import React from 'react';
import MenuModeSetting from "./SettingItem/MenuModeSetting";
import ThemeSetting from "./SettingItem/ThemeSetting";
import LanguageSetting from "./SettingItem/LanguageSetting";
import intl from "react-intl-universal";
import UserPasswordSetting from "./UserSetting/UserPasswordSetting";
import UserInfoSetting from "./UserSetting/UserInfoSetting";
import UsernameSetting from "./UserSetting/UsernameSetting";
import ShowAlert from "./SettingItem/ShowAlert";
import {LStorage} from "../../component/localStrong";
import {useSelector} from "react-redux";
import GaussianBlurSetting from "./SettingItem/GaussianBlurSetting";
import {useGaussianBlurStyles} from "../../styles/gaussianBlurStyle";

const {Title, Text} = Typography;

const Setting = () => {

    const gaussianBlurClasses = useGaussianBlurStyles();

    const isLogin = useSelector((state: any) => state.isLogin.value);
    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value)

    return (
        <Typography>
            {
                LStorage.get('cshbxy-oa-settingAlert') === false ? null : <Alert
                    message={intl.get('attention') + ': ' + intl.get('settingScopesNotice')}
                    type="info"
                    showIcon
                    closable
                    style={{marginBottom: 16}}
                    onClose={() => LStorage.set('cshbxy-oa-settingAlert', false)}
                />
            }
            <Space size={"large"} align={"start"}>
                <div style={{minWidth: 450}}>
                    <Title level={3}>{intl.get('baseSetting')}</Title>
                    <br/>
                    <Space size={"middle"} align={"center"}>
                        <Text>{intl.get('alertMessageStatus')}</Text>
                        <ShowAlert/>
                    </Space>
                    <br/><br/>
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
                    <br/><br/>
                    <Space size={"middle"} align={"center"}>
                        <Tooltip placement="right" title={intl.get('gaussianBlurNotice')}
                                 overlayClassName={gaussianBlur ? gaussianBlurClasses.gaussianBlurTooltip : ''}>
                            <Text>{intl.get('gaussianBlur')}</Text>
                        </Tooltip>
                        <GaussianBlurSetting/>
                    </Space>
                </div>
                <div>
                    {
                        isLogin ? <>
                            <Title level={3}>{intl.get('userSetting')}</Title>
                            <Space size={"middle"} align={"center"}>
                                <UserPasswordSetting/>
                                <UserInfoSetting/>
                                <UsernameSetting/>
                            </Space>
                        </> : null
                    }
                </div>
            </Space>
        </Typography>
    )
}

export default Setting;
