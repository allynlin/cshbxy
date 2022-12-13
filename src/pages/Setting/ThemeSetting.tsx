import type {RadioChangeEvent} from 'antd';
import {Radio} from 'antd';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {darkTheme, lightTheme, sysTheme} from "../../component/redux/sysColorSlice";
import intl from "react-intl-universal";

const ThemeSetting = () => {

    const dispatch = useDispatch();

    const sysColor = useSelector((state: any) => state.sysColor.value)

    const onChange = (e: RadioChangeEvent) => {
        switch (e.target.value) {
            case 'light':
                dispatch(lightTheme())
                break;
            case 'dark':
                dispatch(darkTheme())
                break;
            case 'sys':
                dispatch(sysTheme());
                break;
            default:
                dispatch(sysTheme())
        }
    };

    return (
        <Radio.Group onChange={onChange} value={sysColor} buttonStyle="solid">
            <Radio.Button value={"light"}>{intl.get('lightMode')}</Radio.Button>
            <Radio.Button value={"dark"}>{intl.get('darkMode')}</Radio.Button>
            <Radio.Button value={"sys"}>{intl.get('autoMode')}</Radio.Button>
        </Radio.Group>
    );
};

export default ThemeSetting;
