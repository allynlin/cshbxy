import {Segmented} from 'antd';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {hide, show} from "../../../component/redux/isShowFloatButtonSlice";

const ShowFloatButtonSetting: React.FC = () => {

    const dispatch = useDispatch();

    const isShowFloatButton = useSelector((state: any) => state.isShowFloatButton.value)

    const handleChange = (value: string) => {
        switch (value) {
            case "显示":
                dispatch(show())
                break;
            case "隐藏":
                dispatch(hide())
                break;
            default:
                dispatch(show())
        }
    }

    return (
        <Segmented
            defaultValue={isShowFloatButton ? "显示" : "隐藏"}
            options={['显示', '隐藏']}
            onChange={(e: any) => handleChange(e)}
        />
    );
}

export default ShowFloatButtonSetting;
