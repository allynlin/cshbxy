import {Button, Form, Input, message, Modal} from 'antd';
import React, {useState} from 'react';
import {rejectWorkReport} from "../../../component/axios/api";

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
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
                                                                       open,
                                                                       onCreate,
                                                                       onLoading,
                                                                       onCancel,
                                                                   }) => {
    const [form] = Form.useForm();

    return (
        <Modal
            open={open}
            title="确认"
            okText="驳回"
            okType="danger"
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
                    .catch(err => {
                        message.error(err.message);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
            >
                <Form.Item
                    name="reject_reason"
                    label="驳回原因"
                    rules={[{required: true, message: "请输入驳回原因"}]}
                >
                    <Input.TextArea rows={4} maxLength={100} showCount={true}/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const Reject = (props: any) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const content = props.state;

    const onCreate = (values: any) => {
        setIsLoading(true);
        rejectWorkReport(content.uid, values.reject_reason).then(res => {
            message.success(res.msg);
            setOpen(false);
            setIsLoading(false);
            props.getNewContent(true);
        }).catch(err => {
            setIsLoading(false);
            message.error(err.msg);
        })
    };

    return (
        <>
            <Button
                type="primary"
                onClick={() => {
                    setOpen(true);
                }}
                danger
            >
                驳回
            </Button>
            <CollectionCreateForm
                open={open}
                onCreate={onCreate}
                onLoading={isLoading}
                onCancel={() => {
                    setOpen(false);
                }}
            />
        </>
    );
};

export default Reject;
