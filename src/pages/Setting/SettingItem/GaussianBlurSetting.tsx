import {Segmented} from 'antd';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {close, open} from "../../../component/redux/gaussianBlurSlice";
import {useNavigate} from "react-router-dom";
import {settingChange} from "../../../component/settingChange";

const GaussianBlurSetting: React.FC = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value)

    const handleChange = (value: string) => {
        switch (value) {
            case "开启":
                dispatch(open())
                settingChange('gaussianBlur', true)
                navigate('/loading', {state: 3})
                break;
            case "关闭":
                dispatch(close())
                settingChange('gaussianBlur', false)
                break;
            default:
                dispatch(close())
                settingChange('gaussianBlur', false)
        }
    }

    return (
        <Segmented
            defaultValue={gaussianBlur ? "开启" : "关闭"}
            options={['开启', '关闭']}
            onChange={(e: any) => handleChange(e)}
        />
    );
}

export default GaussianBlurSetting;
