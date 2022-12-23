import React from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import {FloatButton} from 'antd';
import {LaptopOutlined, MobileOutlined, SettingOutlined, TranslationOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import intl from "react-intl-universal";
import {darkTheme, lightTheme} from "../redux/sysColorSlice";
import {Chinese, English} from "../redux/userLanguageSlice";
import {IconSun} from "@arco-design/web-react/icon";

export default function ChangeSystem() {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const themeColor = useSelector((state: any) => state.themeColor.value);
    const userLanguage = useSelector((state: any) => state.userLanguage.value);

    return (
        <FloatButton.Group icon={<SettingOutlined/>} trigger="click">
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
