import {App, Radio} from 'antd';
import React, {memo} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {close, open} from "../../component/redux/gaussianBlurSlice";
import intl from "react-intl-universal";

const GaussianBlur = memo(() => {

    const dispatch = useDispatch();

    const {message} = App.useApp();

    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value)

    const key = "changeGaussianBlur";

    const handleChange = (value: string) => {
        switch (value) {
            case "true":
                dispatch(open())
                message.open({
                    key,
                    type: "info",
                    content: intl.get('getGaussianBlurMessage'),
                })
                break;
            case "false":
                dispatch(close())
                message.open({
                    key,
                    type: "info",
                    content: intl.get('getSolidColorMessage'),
                })
                break;
            default:
                dispatch(open())
        }
    }

    return (
        <Radio.Group onChange={(e: any) => handleChange(e.target.value)} value={gaussianBlur ? "true" : "false"}
                     buttonStyle="solid">
            <Radio.Button value={"true"}>{intl.get('gaussianBlur')}</Radio.Button>
            <Radio.Button value={"false"}>{intl.get('solidColor')}</Radio.Button>
        </Radio.Group>
    );
});

const GaussianBlurSetting = () => {
    return (
        <App>
            <GaussianBlur/>
        </App>
    )
}

export default GaussianBlurSetting;
