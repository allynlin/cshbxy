import {Radio} from 'antd';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Chinese, English} from "../../component/redux/userLanguageSlice";
import intl from "react-intl-universal";

const ThemeSetting = () => {

    const dispatch = useDispatch();

    const userLanguage = useSelector((state: {
        userLanguage: {
            value: 'Chinese' | 'English'
        }
    }) => state.userLanguage.value)

    return (
        <Radio.Group onChange={e => {
            e.target.value === 'Chinese' ? dispatch(Chinese()) : dispatch(English())
        }} value={userLanguage}>
            <Radio value={"Chinese"}>简体中文（Simple Chinses）</Radio>
            <Radio value={"English"}>English</Radio>
        </Radio.Group>
    );
};

export default ThemeSetting;
