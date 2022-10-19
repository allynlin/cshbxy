import type {RadioChangeEvent} from 'antd';
import {Radio} from 'antd';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Chinese, English} from "../../component/redux/userLanguageSlice";
import {LStorage} from "../../component/localStrong";

const ThemeSetting = () => {

    const dispatch = useDispatch();

    const userLanguage: String = useSelector((state: {
        userLanguage: {
            value: 'Chinese' | 'English'
        }
    }) => state.userLanguage.value)

    const onChange = (e: RadioChangeEvent) => {
        switch (e.target.value) {
            case 'Chinese':
                dispatch(Chinese())
                break;
            case 'English':
                dispatch(English())
                break;
            default:
                dispatch(English())
        }
        LStorage.set('userLanguage', e.target.value)
    };

    return (
        <Radio.Group onChange={onChange} value={userLanguage}>
            <Radio value={"Chinese"}>中文</Radio>
            <Radio value={"English"}>English</Radio>
        </Radio.Group>
    );
};

export default ThemeSetting;
