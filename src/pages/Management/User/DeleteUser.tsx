import {Button, message, Modal, Popconfirm} from 'antd';
import React, {useState} from 'react';
import {deleteUser} from "../../../component/axios/api";
import intl from "react-intl-universal";
import {ExclamationCircleOutlined} from '@ant-design/icons';

interface propsCheck {
    content: any;
    getChange: any;
}

export default function DeleteUser(props: propsCheck) {

    const [loading, setLoading] = useState(false);
    const [modal, contextHolder] = Modal.useModal();

    const showConfirm = () => {
        modal.confirm({
            title: intl.get('confirmDeleteUserAgain'),
            icon: <ExclamationCircleOutlined/>,
            content: intl.get('confirmDeleteUserNotice'),
            onOk() {
                setLoading(true);
                deleteUser(props.content.uid).then(() => {
                    message.success(intl.get('deleteUserSuccess'));
                    setLoading(false);
                    props.getChange('yes');
                })
            }
        });
    }

    return (
        <Popconfirm title={intl.get('confirmDeleteUser')} onConfirm={showConfirm}>
            {contextHolder}
            <Button
                disabled={loading}
                loading={loading}
                type="primary" danger>
                {intl.get('deleteUser')}
            </Button>
        </Popconfirm>
    )
};
