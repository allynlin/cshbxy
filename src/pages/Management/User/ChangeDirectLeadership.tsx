import {Button, message, Modal} from 'antd';
import React, {useState} from 'react';
import {updateDepartmentLeader} from "../../../component/axios/api";
import intl from "react-intl-universal";
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {useGaussianBlurStyles} from "../../../styles/gaussianBlurStyle";
import {useSelector} from "react-redux";

interface propsCheck {
    content: any;
    getChange: any;
}

export default function ChangeDirectLeadership(props: propsCheck) {

    const gaussianBlurClasses = useGaussianBlurStyles();

    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value);
    const userInfo = useSelector((state: any) => state.userInfo.value);

    const [loading, setLoading] = useState(false);
    const [modal, contextHolder] = Modal.useModal();

    const showConfirm = () => {
        modal.confirm({
            title: intl.get('confirmSettingDirectLeadership'),
            icon: <ExclamationCircleOutlined/>,
            content: intl.get('settingDirectLeadershipNotice'),
            className: gaussianBlur ? gaussianBlurClasses.gaussianBlurModalMethod : '',
            mask: !gaussianBlur,
            onOk() {
                setLoading(true);
                updateDepartmentLeader(userInfo.uid, props.content.uid).then(() => {
                    message.success(intl.get('settingSuccess'));
                    props.getChange('yes');
                }).finally(() => {
                    setLoading(false);
                })
            }
        });
    }

    return (
        <>
            {contextHolder}
            <Button
                disabled={loading}
                loading={loading}
                onClick={() => showConfirm()}
                type="primary" danger>
                {intl.get('settingDirectLeadership')}
            </Button>
        </>
    )
};
