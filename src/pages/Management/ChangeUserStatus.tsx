import {Button, notification, Popconfirm} from 'antd';
import React, {useEffect, useState} from 'react';
import {updateUserStatus} from "../../component/axios/api";
import intl from "react-intl-universal";
import {RenderUserStatusColor} from "../../component/Tag/RenderUserStatusColor";

interface changeUserStatus {
    content: any;
    getChange: any;
}

const ChangeUserStatus: React.FC<changeUserStatus> = (props) => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [userStatus, setUserStatus] = useState<string>('');

    useEffect(() => {
        switch (props.content.status) {
            case 'Normal':
            case '正常':
                setUserStatus(intl.get('disabled'));
                break;
            case 'Disabled':
            case '禁用':
                setUserStatus(intl.get('normal'));
                break;
            default:
                setUserStatus(intl.get('statusError'));
                setDisabled(true);
                break;

        }
    }, [props.content.status])

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
                notification["error"]({
                    message: intl.get('statusError'),
                    className: 'back-drop'
                })
                return;
        }
        updateUserStatus(props.content.uid, status).then(res => {
            notification["success"]({
                message: intl.get('changeSuccess'),
                className: 'back-drop'
            })
        }).finally(() => {
            setConfirmLoading(false);
            setOpen(false);
            props.getChange(userStatus);
        })
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <Popconfirm
            title={intl.get('confirmChangeUserStatus', {status: userStatus})}
            open={open}
            onConfirm={handleOk}
            okButtonProps={{loading: confirmLoading}}
            onCancel={handleCancel}
        >
            <Button type="primary" disabled={disabled} onClick={showPopconfirm} style={{
                backgroundColor: RenderUserStatusColor(userStatus),
                borderColor: RenderUserStatusColor(userStatus)
            }}>
                {userStatus}
            </Button>
        </Popconfirm>
    );
};

export default ChangeUserStatus;
