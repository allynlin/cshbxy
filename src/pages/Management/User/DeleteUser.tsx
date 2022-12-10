import {Button, message, Modal, Popconfirm} from 'antd';
import React from 'react';
import {deleteUser} from "../../../component/axios/api";
import {red} from "../../../baseInfo";
import intl from "react-intl-universal";
import {ExclamationCircleOutlined} from '@ant-design/icons';

interface delUser {
    content: any;
    getChange: any;
}

const DeleteUser: React.FC<delUser> = (props) => {

    const showConfirm = () => {
        Modal.confirm({
            title: intl.get('confirmDeleteUserAgain'),
            icon: <ExclamationCircleOutlined/>,
            content: intl.get('confirmDeleteUserNotice'),
            onOk() {
                deleteUser(props.content.uid).then(() => {
                    message.success(intl.get('deleteUserSuccess'));
                    props.getChange('yes');
                })
            }
        });
    }

    return (
        <Popconfirm title={intl.get('confirmDeleteUser')} onConfirm={showConfirm}>
            <Button
                type="primary"
                style={{backgroundColor: red, borderColor: red}}>
                {intl.get('deleteUser')}
            </Button>
        </Popconfirm>
    )
};

export default DeleteUser;
