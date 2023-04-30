import {Button, message, Modal} from 'antd';
import React, {useState} from 'react';
import {updateDepartmentLeader} from "../../../component/axios/api";
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {useSelector} from "react-redux";

interface propsCheck {
    content: any;
    getChange: any;
}

export default function ChangeDirectLeadership(props: propsCheck) {
    const userInfo = useSelector((state: any) => state.userInfo.value);

    const [loading, setLoading] = useState(false);
    const [modal, contextHolder] = Modal.useModal();

    const showConfirm = () => {
        modal.confirm({
            title: "确认",
            icon: <ExclamationCircleOutlined/>,
            content: "您正在设置当前部门直属领导，您只能设置一个直属领导，如您已设置直属领导，再次设置将会覆盖之前的设置，是否继续？",
            onOk() {
                setLoading(true);
                updateDepartmentLeader(userInfo.uid, props.content.uid).then(() => {
                    message.success("设置成功");
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
                type="primary" danger>设置直属领导</Button>
        </>
    )
};
