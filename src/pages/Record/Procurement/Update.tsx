import {Button, Form, Input, InputNumber, message, Modal, notification} from 'antd';
import React, {useState} from 'react';
import {blue} from "../../../baseInfo";
import {updateProcurement} from "../../../component/axios/api";
import intl from "react-intl-universal";

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

const Update = (props: any) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const content = props.state;

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
                title={intl.get('updateProcurementApprove')}
                okText={intl.get('update')}
                okButtonProps={{style: {backgroundColor: blue, borderColor: blue}}}
                cancelText={intl.get('cancel')}
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
                                message: intl.get('submitFailed'),
                                description: intl.get('pleaseInputFullInfo'),
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
                        label={intl.get('procurementItem')}
                        name="items"
                        rules={[{required: true, message: intl.get('pleaseInputProcurementItem')}]}
                    >
                        <Input.TextArea rows={4} placeholder={intl.get('pleaseInputProcurementItem')} showCount={true}
                                        maxLength={1000}/>
                    </Form.Item>

                    <Form.Item
                        label={intl.get('procurementPrice')}
                        name="price"
                        rules={[{required: true, message: intl.get('pleaseInputProcurementPrice')}]}
                    >
                        <InputNumber addonAfter={'¥'}/>
                    </Form.Item>

                    <Form.Item
                        label={intl.get('reason')}
                        name="reason"
                        rules={[{required: true, message: intl.get('pleaseInputReason')}]}
                    >
                        <Input.TextArea rows={4} placeholder={intl.get('pleaseInputReason')} showCount={true}
                                        maxLength={1000}/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

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
            message: intl.get('attention'),
            description: intl.get('afterChangeApproveAgain'),
            className: 'back-drop'
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
                {intl.get('update')}
            </Button>
            <CollectionCreateForm
                open={open}
                onCreate={onCreate}
                onLoading={isLoading}
                onCancel={() => {
                    setOpen(false);
                }}
            />
        </div>
    );
};

export default Update;
