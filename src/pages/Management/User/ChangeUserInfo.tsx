import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Modal, Radio} from "antd";
import {lime7} from "../../../baseInfo";
import intl from "react-intl-universal";
import {updateUserInfo} from "../../../component/axios/api";

interface propsCheck {
    info: any;
    getChange: any;
}

export default function ChangeUserInfo(props: propsCheck) {

    // 打开修改弹窗
    const [open, setOpen] = useState(false);
    // 给按钮添加 loading 并且禁用
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            realeName: props.info.realeName,
            email: props.info.email,
            tel: props.info.tel,
            gender: props.info.gender
        })
    }, [props.info])

    const changeUserInfo = (values: any) => {
        setLoading(true);
        updateUserInfo(props.info.uid, values.realeName, values.gender, values.tel, values.email).then(res => {
            if (res.code === 200) {
                message.success(intl.get('changeSuccess'));
                const newContent = {
                    realeName: values.realeName,
                    gender: values.gender,
                    tel: values.tel,
                    email: values.email
                }
                props.getChange(newContent)
                setOpen(false);
            }
        }).finally(() => {
            setLoading(false);
        })
    }

    return (
        <div>
            <Button
                type="primary"
                loading={loading}
                disabled={loading}
                style={{backgroundColor: lime7, borderColor: lime7}}
                onClick={() => {
                    setOpen(true);
                }}
            >
                {intl.get('changeUserInfo')}
            </Button>
            <Modal
                open={open}
                title={intl.get("changeUsername")}
                okText={intl.get('ok')}
                confirmLoading={loading}
                cancelText={intl.get('cancel')}
                onCancel={() => setOpen(false)}
                onOk={() => {
                    form
                        .validateFields()
                        .then(values => {
                            changeUserInfo(values);
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
                        label={intl.get('realName')}
                        name="realeName"
                        rules={[
                            {
                                required: true,
                                message: intl.get('pleaseInputRealName'),
                            },
                        ]}
                    >
                        <Input showCount maxLength={10} allowClear={true}/>
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
        </div>
    )
}
