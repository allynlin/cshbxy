import {Button, message, Modal, Popconfirm} from 'antd';
import React, {useState} from 'react';
import {deleteUser} from "../../../component/axios/api";
import intl from "react-intl-universal";
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {useGaussianBlurStyles} from "../../../styles/gaussianBlurStyle";
import {useSelector} from "react-redux";

interface propsCheck {
    content: any;
    getChange: any;
}

export default function DeleteUser(props: propsCheck) {

    const gaussianBlurClasses = useGaussianBlurStyles();

    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value);

    const [loading, setLoading] = useState(false);
    const [modal, contextHolder] = Modal.useModal();

    const showConfirm = () => {
        modal.confirm({
            title: intl.get('confirmDeleteUserAgain'),
            icon: <ExclamationCircleOutlined/>,
            content: intl.get('confirmDeleteUserNotice'),
            className: gaussianBlur ? gaussianBlurClasses.gaussianBlurModalMethod : '',
            mask: !gaussianBlur,
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
        <Popconfirm
            title={intl.get('confirmDeleteUser')}
            onConfirm={showConfirm}
            overlayClassName={gaussianBlur ? gaussianBlurClasses.gaussianBlurPopconfirm : ''}
        >
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
