import {Button, message, Modal, Popconfirm} from 'antd';
import React, {useState} from 'react';
import {deleteUser} from "../../../component/axios/api";
import {red} from "../../../baseInfo";
import intl from "react-intl-universal";
import {ExclamationCircleOutlined} from '@ant-design/icons';

interface propsCheck {
    content: any;
    getChange: any;
}

export default function DeleteUser(props: propsCheck) {

    const [loading, setLoading] = useState(false);

    const showConfirm = () => {
        Modal.confirm({
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
            <Button
                disabled={loading}
                loading={loading}
                type="primary"
                style={{backgroundColor: red, borderColor: red}}>
                {intl.get('deleteUser')}
            </Button>
        </Popconfirm>
    )
};
