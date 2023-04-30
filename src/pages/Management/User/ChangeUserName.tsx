import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Modal} from "antd";
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
                message.success("修改成功");
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
                onClick={() => {
                    setOpen(true);
                }}
            >修改用户名</Button>
            <Modal
                open={open}
                title="修改用户名"
                okText="确认"
                cancelText="取消"
                confirmLoading={loading}
                onCancel={() => setOpen(false)}
                onOk={() => {
                    if (!usernameUse) {
                        message.error("用户名已存在")
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
                        label="用户名"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "请输入用户名",
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
