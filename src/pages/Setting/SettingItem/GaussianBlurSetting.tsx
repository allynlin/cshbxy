import {Segmented} from 'antd';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {close, open} from "../../../component/redux/gaussianBlurSlice";
import {useNavigate} from "react-router-dom";

const GaussianBlurSetting: React.FC = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value)

    const handleChange = (value: string) => {
        switch (value) {
            case "是":
                dispatch(open())
                navigate('/loading', {state: 3})
                break;
            case "否":
                dispatch(close())
                break;
            default:
                dispatch(close())
        }
    }

    return (
        <Segmented
            defaultValue={gaussianBlur ? "是" : "否"}
            options={['是', '否']}
            onChange={(e: any) => handleChange(e)}
        />
    );
}

export default GaussianBlurSetting;
