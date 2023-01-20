import {Radio, Segmented} from 'antd';
import React, {memo} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Chinese, English} from "../../../component/redux/userLanguageSlice";

const ThemeSetting = memo(() => {

    const dispatch = useDispatch();

    const userLanguage = useSelector((state: any) => state.userLanguage.value)

    const handleChange = (value: any) => {
        switch (value) {
            case "English":
                dispatch(English())
                break;
            case "简体中文（Simple Chinses）":
                dispatch(Chinese())
                break;
            default:
                dispatch(Chinese())
        }
    }

    return (
        <Segmented
            defaultValue={userLanguage === 'Chinese' ? "简体中文（Simple Chinses）" : "English"}
            options={['简体中文（Simple Chinses）', 'English']}
            onChange={(e: any) => handleChange(e)}
        />
    );
});

export default ThemeSetting;
