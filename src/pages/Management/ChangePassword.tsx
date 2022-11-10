import {Button, Form, Input, Modal, notification} from 'antd';
import React, {useState} from 'react';
import intl from "react-intl-universal";
import {updatePassword} from "../../component/axios/api";
import {purple} from "../../baseInfo";

interface Values {
    title: string;
    description: string;
    modifier: string;
}

interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: Values) => void;
    onCancel: () => void;
}

interface changePassword {
    uid: string
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
                                                                       open,
                                                                       onCreate,
                                                                       onCancel,
                                                                   }) => {
    const [form] = Form.useForm();
    return (
        <Modal
            open={open}
            title={intl.get("changePassword")}
            okText={intl.get('ok')}
            cancelText={intl.get('cancel')}
            onCancel={onCancel}
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
                            description: intl.get('pleaseInputAllInfo'),
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
                    name={'password'}
                    label={intl.get("password")}
                    rules={[{required: true, message: intl.get('pleaseInputPassword')}]}
                >
                    <Input.Password maxLength={20} showCount placeholder={intl.get('pleaseInputPassword')}/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const ChangePassword: React.FC<changePassword> = (props) => {
    const [open, setOpen] = useState(false);

    const onCreate = (values: any) => {
        updatePassword(props.uid, values.password).then(res => {
            if (res.code === 200) {
                notification["success"]({
                    message: intl.get('changeSuccess'),
                    className: 'back-drop'
                })
            }
        })
        setOpen(false);
    };

    return (
        <div>
            <Button
                type="primary"
                style={{backgroundColor: purple, borderColor: purple}}
                onClick={() => {
                    setOpen(true);
                }}
            >
                {intl.get('changePassword')}
            </Button>
            <CollectionCreateForm
                open={open}
                onCreate={onCreate}
                onCancel={() => {
                    setOpen(false);
                }}
            />
        </div>
    );
};

export default ChangePassword;
