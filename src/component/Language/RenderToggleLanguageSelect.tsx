import {Select, notification} from "antd";
import {Chinese, English} from "../redux/userLanguageSlice";
import React from "react";
import {useDispatch, useSelector} from "react-redux";

export const RenderToggleLanguageSelect = () => {
    const dispatch = useDispatch()

    const userLanguage = useSelector((state: any) => state.userLanguage.value)

    const handleChange = (value: string) => {
        const showNotice = (value: string) => {
            notification.success({
                message: value,
                placement: 'topRight',
                className: 'back-drop',
            })
        }

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
    };

    const options = [
        {value: 'English', label: "English"},
        {value: 'Chinese', label: "简体中文"},
    ]


    return (
        <Select
            defaultValue="English"
            style={{width: 120}}
            onChange={handleChange}
            options={options}
            value={userLanguage}
        />
    )
}
