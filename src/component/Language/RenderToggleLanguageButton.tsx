import {Button} from "antd";
import {yellow} from "../../baseInfo";
import {Chinese, English} from "../redux/userLanguageSlice";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

export const RenderToggleLanguageButton = () => {
    const dispatch = useDispatch();

    const userLanguage = useSelector((state: {
        userLanguage: {
            value: 'Chinese' | 'English'
        }
    }) => state.userLanguage.value)
    return (
        <Button style={{backgroundColor: yellow, borderColor: yellow, color: '#ffffff'}} onClick={() => {
            userLanguage === 'English' ? dispatch(Chinese()) : dispatch(English())
        }}>{userLanguage === 'English' ? '简体中文（Simple Chinses）' : 'English'}</Button>
    )
}
