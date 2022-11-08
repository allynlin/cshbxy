import {notification, Radio} from 'antd';
import React, {memo} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Chinese, English} from "../../component/redux/userLanguageSlice";

const ThemeSetting = memo(() => {

    const dispatch = useDispatch();

    const userLanguage = useSelector((state: any) => state.userLanguage.value)

    const showNotice = (value: string) => {
        notification.success({
            message: value,
            placement: 'topRight',
            className: 'back-drop',
        })
    }

    const handleChange = (value: string) => {
        switch (value) {
            case "English":
                dispatch(English())
                showNotice('The current language has been switched to English, if the page display is not in English, please refresh the page')
                break;
            case "Chinese":
                dispatch(Chinese())
                showNotice('当前语言已切换为中文，如果页面显示不是中文，请刷新页面')
                break;
            default:
                dispatch(English())
                showNotice('Selection exception, reset to default language (English)')
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
