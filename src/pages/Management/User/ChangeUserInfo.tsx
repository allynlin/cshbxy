import {Button, Form, Input, Modal, message, Radio} from 'antd';
import React, {useState} from 'react';
import intl from "react-intl-universal";
import {updateUserInfo} from "../../../component/axios/api";
import {lime7} from "../../../baseInfo";

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

interface changeUserInfo {
    content: any;
    getChange: any;
}

const ChangeUserInfo: React.FC<changeUserInfo> = (props) => {
    const [open, setOpen] = useState(false);

    const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
                                                                           open,
                                                                           onCreate,
                                                                           onCancel,
                                                                       }) => {
        const [form] = Form.useForm();

        return (
            <Modal
                open={open}
                title={intl.get("changeUserInfo")}
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
                        .catch(err => {
                            message.error(err.message);
                        });
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                        realeName: props.content.realeName,
                        email: props.content.email,
                        tel: props.content.tel,
                        gender: props.content.gender
                    }}
                >
                    <Form.Item
                        label={intl.get('realName')}
                        name="realeName"
                        rules={[
                            {
                                required: true,
                                message: intl.get('pleaseInputRealName'),
                                pattern: /^[\u4e00-\u9fa5]{2,4}$/
                            },
                        ]}
                    >
                        <Input showCount maxLength={4} allowClear={true}/>
                    </Form.Item>

                    <Form.Item
                        label={intl.get('gender')}
                        name="gender"
                        rules={[
                            {
                                required: true,
                                message: intl.get('pleaseChooseGender'),
                            },
                        ]}
                    >
                        <Radio.Group buttonStyle="solid" style={{display: "flex"}}>
                            <Radio.Button value="男">{intl.get('male')}</Radio.Button>
                            <Radio.Button value="女">{intl.get('female')}</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label={intl.get('tel')}
                        name="tel"
                        rules={[
                            {
                                required: true,
                                message: intl.get('pleaseInputTel'),
                                pattern: /^1[3456789]\d{9}$/
                            },
                        ]}
                    >
                        <Input type={"tel"} showCount maxLength={11} allowClear={true}/>
                    </Form.Item>

                    <Form.Item
                        label={intl.get('email')}
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: intl.get('pleaseInputEmail'),
                                pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                            },
                        ]}
                    >
                        <Input type={"email"} showCount maxLength={30} allowClear={true}/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    const onCreate = (values: any) => {
        updateUserInfo(props.content.uid, values.realeName, values.gender, values.tel, values.email).then(res => {
            if (res.code === 200) {
                message.success(intl.get('changeSuccess'));
                const newContent = {
                    ...props.content,
                    realeName: values.realeName,
                    gender: values.gender,
                    tel: values.tel,
                    email: values.email
                }
                props.getChange(newContent)
            }
        })
        setOpen(false);
    };

    return (
        <div>
            <Button
                type="primary"
                style={{backgroundColor: lime7, borderColor: lime7}}
                onClick={() => {
                    setOpen(true);
                }}
            >
                {intl.get('changeUserInfo')}
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

export default ChangeUserInfo;
