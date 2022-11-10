import {Button, Form, Input, Modal, notification} from 'antd';
import React, {useState} from 'react';
import intl from "react-intl-universal";
import {checkUsername, updateUserName} from "../../component/axios/api";
import {orange5} from "../../baseInfo";

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

interface changeUserName {
    content: any;
    getChange: any;
}

const ChangeUsername: React.FC<changeUserName> = (props) => {
    const [open, setOpen] = useState(false);

    const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
                                                                           open,
                                                                           onCreate,
                                                                           onCancel,
                                                                       }) => {
        const [form] = Form.useForm();
        const [usernameUse, setUsernameUse] = useState<boolean>(false);

        let timeOut: any;

        const checkUserName = (e: any) => {
            // 防抖
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                checkUsername(e.target.value, props.content.userType).then(() => {
                    setUsernameUse(true)
                }).catch(() => {
                    setUsernameUse(false)
                })
            }, 500)
        }

        return (
            <Modal
                open={open}
                title={intl.get("changeUsername")}
                okText={intl.get('ok')}
                cancelText={intl.get('cancel')}
                onCancel={onCancel}
                onOk={() => {
                    if (!usernameUse) {
                        notification["error"]({
                            message: intl.get('usernameIsExist'),
                            className: 'back-drop'
                        });
                        return
                    }
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
                    initialValues={{
                        username: props.content.username,
                    }}
                >
                    <Form.Item
                        label={intl.get('username')}
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: intl.get('pleaseInputUsername'),
                                pattern: /^[a-zA-Z0-9]{1,20}$/
                            },
                        ]}
                    >
                        <Input showCount maxLength={20} allowClear={true} onChange={e => {
                            checkUserName(e)
                        }}/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    const onCreate = (values: any) => {
        updateUserName(props.content.uid, values.username).then(res => {
            if (res.code === 200) {
                notification["success"]({
                    message: intl.get('changeSuccess'),
                    className: 'back-drop'
                })
                props.getChange(values.username)
            }
        })
        setOpen(false);
    };

    return (
        <div>
            <Button
                type="primary"
                style={{backgroundColor: orange5, borderColor: orange5}}
                onClick={() => {
                    setOpen(true);
                }}
            >
                {intl.get('changeUsername')}
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

export default ChangeUsername;
