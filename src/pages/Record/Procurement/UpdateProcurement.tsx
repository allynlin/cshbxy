import {Button, Form, Input, InputNumber, message, Modal} from 'antd';
import React, {useState} from 'react';
import {updateProcurement} from "../../../component/axios/api";
import {ExclamationCircleOutlined} from "@ant-design/icons";

interface prop {
    state: any,
    getNewContent: any
}

export const UpdateProcurement = (props: prop) => {
    const content = props.state;
    // 监听表单数据
    const [form] = Form.useForm();
    const items = Form.useWatch('items', form);
    const price = Form.useWatch('price', form);
    const reason = Form.useWatch('reason', form);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        showUpdateConfirm();
    };

    const handleCancel = () => {
        showCancelConfirm();
    };

    // 修改确认框
    const showUpdateConfirm = () => {
        Modal.confirm({
            title: '确认修改申请吗？',
            icon: <ExclamationCircleOutlined/>,
            content: '修改后需要重新进行审批，是否确认修改？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                setConfirmLoading(true);
                updateForm();
            }
        });
    };

    // 放弃修改确认框
    const showCancelConfirm = () => {
        Modal.confirm({
            title: '放弃修改？',
            icon: <ExclamationCircleOutlined/>,
            content: '放弃修改后将不会保存修改，是否确认放弃？',
            okText: '放弃',
            okType: 'danger',
            cancelText: '继续修改',
            onOk() {
                setOpen(false);
            }
        });
    };

    const updateForm = () => {
        updateProcurement(content.uid, items, price, reason).then(res => {
            message.success(res.msg);
            setOpen(false);
            setConfirmLoading(false);
            // props.getNewContent 返回给父组件,父组件接收一个对象，对象中有 reason,start_time,end_time
            props.getNewContent({
                items: items,
                price: price,
                reason: reason
            });
        }).catch(err => {
            message.error(err.msg);
            setConfirmLoading(false);
        })
    }

    return (
        <>
            <Button type="primary" onClick={showModal}>
                修改
            </Button>
            <Modal
                title={'修改采购申请'}
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                width={800}
            >
                <Form
                    form={form}
                    name="basic"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    initialValues={{
                        items: content.items,
                        price: content.price,
                        reason: content.reason
                    }}
                >
                    <Form.Item
                        label="采购物品"
                        name="items"
                        rules={[{required: true, message: '请输入采购物品'}]}
                    >
                        <Input.TextArea rows={4} placeholder={"请输入采购物品，不超过1000字"} showCount={true}
                                        maxLength={1000}/>
                    </Form.Item>

                    <Form.Item
                        label="采购费用"
                        name="price"
                        rules={[{required: true, message: '请输入采购费用'}]}
                    >
                        <InputNumber addonAfter={'¥'}/>
                    </Form.Item>

                    <Form.Item
                        label="采购原因"
                        name="reason"
                        rules={[{required: true, message: '请输入采购原因'}]}
                    >
                        <Input.TextArea rows={4} placeholder={"请输入采购原因，不超过1000字"} showCount={true}
                                        maxLength={1000}/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
