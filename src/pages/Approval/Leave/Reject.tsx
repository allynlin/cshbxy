import {Button, Form, Input, message, Modal} from 'antd';
import React, {useState} from 'react';
import {rejectLeave} from "../../../component/axios/api";
import intl from "react-intl-universal";
import {useGaussianBlurStyles} from "../../../styles/gaussianBlurStyle";
import {useSelector} from "react-redux";

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

    const gaussianBlurClasses = useGaussianBlurStyles();

    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value)

    return (
        <Modal
            open={open}
            className={gaussianBlur ? gaussianBlurClasses.gaussianBlurModal : ''}
            mask={!gaussianBlur}
            title={intl.get('confirm')}
            okText={intl.get('reject')}
            okType="danger"
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
        rejectLeave(content.uid, values.reject_reason).then(res => {
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
        </>
    );
};

export default Reject;
