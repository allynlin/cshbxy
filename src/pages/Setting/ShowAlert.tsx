import React from "react";
import {useNavigate} from "react-router-dom";
import {App, Radio, RadioChangeEvent} from "antd";
import intl from "react-intl-universal";
import {LStorage} from "../../component/localStrong";

const ShowAlert: React.FC = () => {

    const navigate = useNavigate();

    const {message} = App.useApp();

    const key = "showAlertSetting"

    const onChange = (e: RadioChangeEvent) => {
        switch (e.target.value) {
            case 'on':
                LStorage.delete('cshbxy-oa-isShowAlert')
                LStorage.delete('cshbxy-oa-isShowTour')
                LStorage.delete('cshbxy-oa-settingAlert')
                message.open({
                    key,
                    type: "success",
                    content: intl.get('showAlertMessage'),
                })
                navigate('/setting')
                break;
            case 'off':
                LStorage.set('cshbxy-oa-isShowAlert', false)
                LStorage.set('cshbxy-oa-isShowTour', false)
                LStorage.set('cshbxy-oa-settingAlert', false)
                message.open({
                    key,
                    type: "success",
                    content: intl.get('hideAlertMessage'),
                })
                navigate('/setting')
                break;
            default:
                message.open({
                    key,
                    type: "warning",
                    content: intl.get('alertMessageStatusError'),
                })
        }
    }

    return (
        <Radio.Group onChange={onChange} buttonStyle="solid">
            <Radio.Button value={"on"}>{intl.get('showAlert')}</Radio.Button>
            <Radio.Button value={"off"}>{intl.get('hideAlert')}</Radio.Button>
        </Radio.Group>
    )
}

const AlertSetting = () => {
    return (
        <App>
            <ShowAlert/>
        </App>
    )
}

export default AlertSetting;
