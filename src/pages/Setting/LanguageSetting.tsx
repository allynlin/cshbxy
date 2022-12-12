import {Radio} from 'antd';
import React, {memo} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Chinese, English} from "../../component/redux/userLanguageSlice";

const ThemeSetting = memo(() => {

    const dispatch = useDispatch();

    const userLanguage = useSelector((state: any) => state.userLanguage.value)

    const handleChange = (value: string) => {
        switch (value) {
            case "English":
                dispatch(English())
                break;
            case "Chinese":
                dispatch(Chinese())
                break;
            default:
                dispatch(Chinese())
        }
    }

    return (
        <Radio.Group onChange={(e: any) => handleChange(e.target.value)} value={userLanguage}>
            <Radio value={"Chinese"}>简体中文（Simple Chinses）</Radio>
            <Radio value={"English"}>English</Radio>
        </Radio.Group>
    );
});

export default ThemeSetting;
