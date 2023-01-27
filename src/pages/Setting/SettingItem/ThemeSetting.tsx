import {Segmented} from 'antd';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {darkTheme, lightTheme, sysTheme} from "../../../component/redux/sysColorSlice";
import {settingChange} from "../../../component/settingChange";

const ThemeSetting = () => {

    const dispatch = useDispatch();

    const sysColor = useSelector((state: any) => state.sysColor.value)

    const onChange = (e: any) => {
        switch (e) {
            case '浅色模式':
                dispatch(lightTheme())
                settingChange('theme', "light")
                break;
            case '深色模式':
                dispatch(darkTheme())
                settingChange('theme', "dark")
                break;
            case '跟随系统':
                dispatch(sysTheme());
                settingChange('theme', "sys")
                break;
            default:
                dispatch(sysTheme())
                settingChange('theme', "sys")
        }
    };

    const getDefaultValue = () => {
        switch (sysColor) {
            case 'light':
                return '浅色模式'
            case 'dark':
                return '深色模式'
            case 'sys':
                return '跟随系统'
            default:
                return '跟随系统'
        }
    }

    return (
        <Segmented
            defaultValue={getDefaultValue()}
            options={['浅色模式', '深色模式', '跟随系统']}
            onChange={(e: any) => onChange(e)}
        />
    );
};

export default ThemeSetting;
