import {Button, Form, Input, message, Modal, notification} from 'antd';
import React, {useState} from 'react';
import {red} from "../../../baseInfo";
import {rejectProcurement} from "../../../component/axios/api";
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
            title={intl.get('confirm')}
            okText={intl.get('reject')}
            okButtonProps={{style: {backgroundColor: red, borderColor: red}}}
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
                            message: intl.get('rejectFailed'),
                            description: intl.get('rejectReasonCannotBeEmpty'),
                            className: 'back-drop'
                        });
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
                    label={intl.get('rejectReason')}
                    rules={[{required: true, message: intl.get('pleaseInputRejectReason')}]}
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
        rejectProcurement(content.uid, values.reject_reason).then(res => {
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
        <div>
            <Button
                type="primary"
                onClick={() => {
                    setOpen(true);
                }}
                style={{backgroundColor: red, borderColor: red}}
            >
                {intl.get('reject')}
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

export default Reject;
