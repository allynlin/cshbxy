import {Button, message, Popconfirm} from 'antd';
import React, {useEffect, useState} from 'react';
import {updateUserStatus} from "../../../component/axios/api";
import {RenderUserStatusColor} from "../../../component/Tag/RenderUserStatusColor";

interface propsCheck {
    info: any;
    getChange: any;
}

export default function ChangeUserStatus(props: propsCheck) {

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [userStatus, setUserStatus] = useState<string>('');

    useEffect(() => {
        switch (props.info.status) {
            case 0:
                setUserStatus("禁用");
                break;
            case -1:
                setUserStatus("正常");
                break;
            default:
                setUserStatus("状态错误");
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
            case '正常':
                status = 0;
                break;
            case '禁用':
                status = -1;
                break;
            default:
                message.error("状态错误");
                return;
        }
        updateUserStatus(props.info.uid, status).then(() => {
            message.success("修改成功");
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
            title={`确认修改用户状态为${userStatus}吗？`}
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
