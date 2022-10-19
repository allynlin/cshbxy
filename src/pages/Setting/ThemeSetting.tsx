import type {RadioChangeEvent} from 'antd';
import {Radio} from 'antd';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {lightTheme, darkTheme, sysTheme} from "../../component/redux/sysColorSlice";
import {LStorage} from "../../component/localStrong";

const ThemeSetting = () => {

    const dispatch = useDispatch();
    const [isEnglish, setIsEnglish] = useState(true);

    const userLanguage: String = useSelector((state: {
        userLanguage: {
            value: 'Chinese' | 'English'
        }
    }) => state.userLanguage.value)

    useEffect(() => {
        setIsEnglish(userLanguage === 'English')
    }, [userLanguage])

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
            <Radio value={"light"}>{isEnglish ? 'light' : '浅色'}</Radio>
            <Radio value={"dark"}>{isEnglish ? 'dark' : '深色'}</Radio>
            <Radio value={"sys"}>{isEnglish ? 'sys' : '跟随系统'}</Radio>
        </Radio.Group>
    );
};

export default ThemeSetting;
