import type {RadioChangeEvent} from 'antd';
import {Radio} from 'antd';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {darkTheme, lightTheme, sysTheme} from "../../component/redux/sysColorSlice";
import {LStorage} from "../../component/localStrong";
import intl from "react-intl-universal";

const ThemeSetting = () => {

    const dispatch = useDispatch();

    const sysColor: String = useSelector((state: {
        sysColor: {
            value: 'light' | 'dark' | 'sys'
        }
    }) => state.sysColor.value)

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
                dispatch(lightTheme())
        }
        LStorage.set('themeColor', e.target.value)
    };

    return (
        <Radio.Group onChange={onChange} value={sysColor}>
            <Radio value={"light"}>{intl.get('Light-Mode')}</Radio>
            <Radio value={"dark"}>{intl.get('Dark-Mode')}</Radio>
            <Radio value={"sys"}>{intl.get('System-Mode')}</Radio>
        </Radio.Group>
    );
};

export default ThemeSetting;
