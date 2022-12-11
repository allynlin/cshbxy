import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Modal} from "antd";
import {orange5} from "../../../baseInfo";
import intl from "react-intl-universal";
import {checkUsername, updateUserName} from "../../../component/axios/api";

interface propsCheck {
    info: any;
    getChange: any;
}

export default function ChangeUserNamePreview(props: propsCheck) {

    // 打开修改弹窗
    const [open, setOpen] = useState(false);
    // 用户名是否可用
    const [usernameUse, setUsernameUse] = useState<boolean>(false);
    // 给按钮添加 loading 并且禁用
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    let timeOut: any;
    useEffect(() => {
        form.setFieldsValue({
            username: props.info.username
        })
    }, [props.info.username])

    const checkUserName = (e: any) => {
        // 防抖
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            checkUsername(e.target.value, props.info.userType).then(() => {
                setUsernameUse(true)
            }).catch(() => {
                setUsernameUse(false)
            })
        }, 500)
    }

    const changeUsername = (values: any) => {
        setLoading(true);
        updateUserName(props.info.uid, values.username).then(res => {
            if (res.code === 200) {
                message.success(intl.get("changeSuccess"));
                props.getChange(values.username)
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
                disabled={loading}
                loading={loading}
                style={{backgroundColor: orange5, borderColor: orange5}}
                onClick={() => {
                    setOpen(true);
                }}
            >
                {intl.get('changeUsername')}
            </Button>
            <Modal
                open={open}
                title={intl.get("changeUsername")}
                okText={intl.get('ok')}
                cancelText={intl.get('cancel')}
                confirmLoading={loading}
                onCancel={() => setOpen(false)}
                onOk={() => {
                    if (!usernameUse) {
                        message.error(intl.get("usernameIsExist"))
                        return
                    }
                    form
                        .validateFields()
                        .then(values => {
                            form.resetFields();
                            changeUsername(values);
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
        </div>
    )
}
