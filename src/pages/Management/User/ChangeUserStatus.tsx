import {Button, message, Popconfirm} from 'antd';
import React, {useEffect, useState} from 'react';
import {updateUserStatus} from "../../../component/axios/api";
import intl from "react-intl-universal";
import {RenderUserStatusColor} from "../../../component/Tag/RenderUserStatusColor";
import {useGaussianBlurStyles} from "../../../styles/gaussianBlurStyle";
import {useSelector} from "react-redux";

interface propsCheck {
    info: any;
    getChange: any;
}

export default function ChangeUserStatus(props: propsCheck) {

    const gaussianBlurClasses = useGaussianBlurStyles();

    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value);

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [userStatus, setUserStatus] = useState<string>('');

    useEffect(() => {
        switch (props.info.status) {
            case 0:
                setUserStatus(intl.get('disabled'));
                break;
            case -1:
                setUserStatus(intl.get('normal'));
                break;
            default:
                setUserStatus(intl.get('statusError'));
                break;
        }
    }, [props.info.status])

    const showPopconfirm = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);

        let status: number;
        switch (userStatus) {
            case 'Normal':
            case '正常':
                status = 0;
                break;
            case 'Disabled':
            case '禁用':
                status = -1;
                break;
            default:
                message.error(intl.get('statusError'));
                return;
        }
        updateUserStatus(props.info.uid, status).then(() => {
            message.success(intl.get('changeSuccess'));
        }).finally(() => {
            setConfirmLoading(false);
            setOpen(false);
            props.getChange(status);
        })
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <Popconfirm
            overlayClassName={gaussianBlur ? gaussianBlurClasses.gaussianBlurPopconfirm : ''}
            title={intl.get('confirmChangeUserStatus', {status: userStatus})}
            open={open}
            onConfirm={handleOk}
            okButtonProps={{loading: confirmLoading}}
            onCancel={handleCancel}
        >
            <Button type="primary" loading={confirmLoading} disabled={confirmLoading} onClick={showPopconfirm} style={{
                backgroundColor: RenderUserStatusColor(userStatus),
                borderColor: RenderUserStatusColor(userStatus)
            }}>
                {userStatus}
            </Button>
        </Popconfirm>
    );
};
