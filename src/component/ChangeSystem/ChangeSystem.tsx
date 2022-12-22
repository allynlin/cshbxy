import React from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import {FloatButton} from 'antd';
import {LaptopOutlined, MobileOutlined, SettingOutlined} from '@ant-design/icons';
import light from './light.svg'
import dark from './dark.svg'
import zhLight from './zh-light.svg'
import enLight from './en-light.svg'
import zhDark from './zh-dark.svg'
import enDark from './en-dark.svg'
import {useDispatch, useSelector} from "react-redux";
import intl from "react-intl-universal";
import {darkTheme, lightTheme} from "../redux/sysColorSlice";
import {Chinese, English} from "../redux/userLanguageSlice";

export default function ChangeSystem() {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const themeColor = useSelector((state: any) => state.themeColor.value);
    const userLanguage = useSelector((state: any) => state.userLanguage.value);

    const languageIcon = () => {
        switch (themeColor) {
            case "light":
                return userLanguage === "Chinese" ? enLight : zhLight
            case "dark":
                return userLanguage === "Chinese" ? enDark : zhDark
        }
    }

    return (
        <FloatButton.Group icon={<SettingOutlined/>} trigger="click">
            <FloatButton
                onClick={() => themeColor === 'light' ? dispatch(darkTheme()) : dispatch(lightTheme())}
                tooltip={themeColor === 'light' ? intl.get('darkMode') : intl.get('lightMode')}
                icon={<img src={themeColor === "light" ? dark : light} alt={'theme'} style={{width: '100%'}}/>}
            />
            <FloatButton
                onClick={() => userLanguage === 'Chinese' ? dispatch(English()) : dispatch(Chinese())}
                tooltip={userLanguage === 'Chinese' ? 'English' : '简体中文'}
                icon={<img src={languageIcon()} alt={'language'} style={{width: '100%'}}/>}
            />
            <FloatButton
                tooltip={location.pathname.slice(0, 2) === '/m' ?intl.get('WebTerminal'):intl.get('mobileTerminal')}
                icon={location.pathname.slice(0, 2) === '/m' ? <LaptopOutlined/> : <MobileOutlined/>}
                onClick={() => location.pathname.slice(0, 2) === '/m' ? navigate('/home') : navigate('/m/home')}
            />
        </FloatButton.Group>
    )
}
