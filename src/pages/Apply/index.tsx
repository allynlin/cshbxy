import React from "react";
import intl from "react-intl-universal";
import {Chinese, English} from "../../component/redux/userLanguageSlice";
import {Radio} from "antd";
import {useDispatch, useSelector} from "react-redux";

const Apply = () => {
    const userLanguage = useSelector((state: {
        userLanguage: {
            value: 'Chinese' | 'English'
        }
    }) => state.userLanguage.value)
    const dispatch = useDispatch()
    return (
        <div>
            {intl.get('changeLanguage')}
            <Radio.Group onChange={e => {
                e.target.value === 'Chinese' ? dispatch(Chinese()) : dispatch(English())
            }} value={userLanguage}>
                <Radio value={"Chinese"}>简体中文（Simple Chinses）</Radio>
                <Radio value={"English"}>English</Radio>
            </Radio.Group>
        </div>
    )
}

export default Apply;
