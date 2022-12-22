import React from "react";
import {Radio, RadioChangeEvent, message} from "antd";
import intl from "react-intl-universal";
import {LStorage} from "../../component/localStrong";

const showAlert: React.FC = () => {

    const [api, contextHolder] = message.useMessage();

    const onChange = (e: RadioChangeEvent) => {
        switch (e.target.value) {
            case 'on':
                LStorage.delete('cshbxy-oa-isShowAlert')
                LStorage.delete('cshbxy-oa-isShowTour')
                LStorage.delete('cshbxy-oa-settingAlert')
                api.success(intl.get('showAlertMessage'));
                break;
            case 'off':
                LStorage.set('cshbxy-oa-isShowAlert', false)
                LStorage.set('cshbxy-oa-isShowTour', false)
                LStorage.set('cshbxy-oa-settingAlert', false)
                api.success(intl.get('hideAlertMessage'));
                break;
            default:
                api.warning(intl.get('alertMessageStatusError'))
        }
    }

    return (
        <Radio.Group onChange={onChange} buttonStyle="solid">
            {contextHolder}
            <Radio.Button value={"on"}>{intl.get('showAlert')}</Radio.Button>
            <Radio.Button value={"off"}>{intl.get('hideAlert')}</Radio.Button>
        </Radio.Group>
    )
}

export default showAlert;
