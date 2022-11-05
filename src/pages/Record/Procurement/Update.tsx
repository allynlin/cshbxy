import {Button, DatePicker, Form, Input, InputNumber, message, Modal, notification} from 'antd';
import React, {useState} from 'react';
import {blue} from "../../../baseInfo";
import {updateLeave, updateProcurement} from "../../../component/axios/api";
import moment from "moment";

interface Values {
    title: string;
    description: string;
    modifier: string;
}

interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: Values) => void;
    onLoading: boolean;
    onCancel: () => void;
    content: any;
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
                                                                       open,
                                                                       onCreate,
                                                                       onLoading,
                                                                       onCancel,
                                                                       content
                                                                   }) => {
    const [form] = Form.useForm();
    return (
        <Modal
            open={open}
            title={'修改请假申请'}
            okText="修改"
            okButtonProps={{style: {backgroundColor: blue, borderColor: blue}}}
            cancelText="取消"
            onCancel={onCancel}
            confirmLoading={onLoading}
            onOk={() => {
                form
                    .validateFields()
                    .then(values => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch(() => {
                        notification["error"]({
                            message: '提交失败',
                            description: '请填写完整信息',
                        });
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
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
    );
};

const Update = (props: any) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const content = props.state;

    const onCreate = (values: any) => {
        setIsLoading(true);
        updateProcurement(content.uid, values.items, values.price, values.reason).then(res => {
            message.success(res.msg);
            setOpen(false);
            setIsLoading(false);
            // props.getNewContent 返回给父组件,父组件接收一个对象，对象中有 reason,start_time,end_time
            props.getNewContent({
                items: values.items,
                price: values.price,
                reason: values.reason
            });
        }).catch(err => {
            message.error(err.msg);
            setIsLoading(false);
        })
    };

    const openNotification = () => {
        notification["warning"]({
            message: '请注意',
            description:
                '修改采购申请后，需要重新审核',
        });
    };

    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    setOpen(true);
                    openNotification();
                }}
            >
                修改
            </Button>
            <CollectionCreateForm
                open={open}
                onCreate={onCreate}
                onLoading={isLoading}
                onCancel={() => {
                    setOpen(false);
                }}
                content={content}
            />
        </div>
    );
};

export default Update;
