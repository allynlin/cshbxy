import {Segmented} from 'antd';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {hide, show} from "../../../component/redux/isShowFloatButtonSlice";
import {settingChange} from "../../../component/settingChange";

const ShowFloatButtonSetting: React.FC = () => {

    const dispatch = useDispatch();

    const isShowFloatButton = useSelector((state: any) => state.isShowFloatButton.value)

    const handleChange = (value: string) => {
        switch (value) {
            case "显示（show）":
                dispatch(show())
                settingChange('showFloatButton', true)
                break;
            case "隐藏（hide）":
                dispatch(hide())
                settingChange('showFloatButton', false)
                break;
            default:
                dispatch(show())
                settingChange('showFloatButton', true)
        }
    }

    return (
        <Segmented
            defaultValue={isShowFloatButton ? "显示（show）" : "隐藏（hide）"}
            options={['显示（show）', '隐藏（hide）']}
            onChange={(e: any) => handleChange(e)}
        />
    );
}

export default ShowFloatButtonSetting;
