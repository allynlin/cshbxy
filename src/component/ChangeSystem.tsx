import React from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {App, FloatButton} from 'antd';
import {
    ExperimentOutlined,
    LaptopOutlined,
    MobileOutlined,
    SettingOutlined,
    TranslationOutlined
} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import intl from "react-intl-universal";
import {IconSun} from "@arco-design/web-react/icon";

import {darkTheme, lightTheme} from "./redux/sysColorSlice";
import {Chinese, English} from "./redux/userLanguageSlice";
import {close, open} from "./redux/gaussianBlurSlice";

const ChangeSystem = () => {

    const {message} = App.useApp();

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const themeColor = useSelector((state: any) => state.themeColor.value);
    const userLanguage = useSelector((state: any) => state.userLanguage.value);
    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value);

    const key = "changeGaussianBlur";

    const changeGaussianBlur = () => {
        if (gaussianBlur) {
            dispatch(close());
            message.open({
                key,
                type: "info",
                content: intl.get('getSolidColorMessage'),
            })
            return
        }
        dispatch(open());
        message.open({
            key,
            type: "info",
            content: intl.get('getGaussianBlurMessage'),
        })
    }

    return (
        <FloatButton.Group icon={<SettingOutlined/>} trigger="click">
            <FloatButton
                onClick={() => changeGaussianBlur()}
                tooltip={gaussianBlur === false ? intl.get('enableGaussianBlur') : intl.get('enableSolidColor')}
                icon={<ExperimentOutlined/>}
            />
            <FloatButton
                onClick={() => themeColor === 'light' ? dispatch(darkTheme()) : dispatch(lightTheme())}
                tooltip={themeColor === 'light' ? intl.get('darkMode') : intl.get('lightMode')}
                icon={<IconSun/>}
            />
            <FloatButton
                onClick={() => userLanguage === 'Chinese' ? dispatch(English()) : dispatch(Chinese())}
                tooltip={userLanguage === 'Chinese' ? 'English' : '简体中文'}
                icon={<TranslationOutlined/>}
            />
            <FloatButton
                tooltip={location.pathname.slice(0, 2) === '/m' ? intl.get('WebTerminal') : intl.get('mobileTerminal')}
                icon={location.pathname.slice(0, 2) === '/m' ? <LaptopOutlined/> : <MobileOutlined/>}
                onClick={() => location.pathname.slice(0, 2) === '/m' ? navigate('/home') : navigate('/m/home')}
            />
        </FloatButton.Group>
    )
}

const ChangeSystemSetting = () => {
    return (
        <App>
            <ChangeSystem/>
        </App>
    )
}

export default ChangeSystemSetting;
