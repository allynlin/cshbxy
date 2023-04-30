import {Button, message, Modal, Popconfirm} from 'antd';
import React, {useState} from 'react';
import {deleteUser} from "../../../component/axios/api";
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
            title: "最后一次确认删除用户吗？",
            icon: <ExclamationCircleOutlined/>,
            content: "删除用户后不可恢复，请谨慎操作",
            onOk() {
                setLoading(true);
                deleteUser(props.content.uid).then(() => {
                    message.success("删除用户成功");
                    props.getChange('yes');
                }).finally(() => {
                    setLoading(false);
                })
            }
        });
    }

    return (
        <Popconfirm title="确认删除用户吗？" onConfirm={showConfirm}>
            {contextHolder}
            <Button disabled={loading} loading={loading} type="primary" danger>删除用户</Button>
        </Popconfirm>
    )
};
