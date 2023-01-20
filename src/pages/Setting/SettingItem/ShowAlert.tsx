import React from "react";
import {useNavigate} from "react-router-dom";
import {App, Segmented} from "antd";
import intl from "react-intl-universal";
import {LStorage} from "../../../component/localStrong";

const ShowAlert: React.FC = () => {

    const navigate = useNavigate();

    const {message} = App.useApp();

    const key = "showAlertSetting"

    const changeTipsShow = (e: any) => {
        switch (e) {
            case '显示':
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
            case '隐藏':
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
        <Segmented
            defaultValue={LStorage.get('cshbxy-oa-isShowAlert') ? "显示" : "隐藏"}
            options={['显示', '隐藏']}
            onChange={(e: any) => changeTipsShow(e)}
        />
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
