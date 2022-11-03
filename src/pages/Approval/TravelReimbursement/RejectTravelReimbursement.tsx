import {Button, Form, Input, message, Modal, notification} from 'antd';
import React, {useState} from 'react';
import {red} from "../../../baseInfo";
import {rejectTravel} from "../../../component/axios/api";

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
            title={'驳回申请'}
            okText="驳回"
            okButtonProps={{style: {backgroundColor: red, borderColor: red}}}
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
                            description: '驳回原因不能为空',
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
                    label="驳回理由"
                    rules={[{required: true, message: '请输入驳回理由'}]}
                >
                    <Input.TextArea rows={4} maxLength={100} showCount={true}/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const RejectTravelReimbursement = (props: any) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const content = props.state;

    const onCreate = (values: any) => {
        setIsLoading(true);
        rejectTravel(content.uid, values.reject_reason).then(res => {
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
        </div>
    );
};

export default RejectTravelReimbursement;
