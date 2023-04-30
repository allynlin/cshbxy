import React, {useState} from "react";
import {Button, Form, Input, message, Modal} from "antd";
import {updatePassword} from "../../../component/axios/api";

interface propsCheck {
    uid: string;
}

export default function ChangePassword(props: propsCheck) {

    // 打开修改弹窗
    const [open, setOpen] = useState(false);
    // 给按钮添加 loading 并且禁用
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    const changeUserPassword = (values: any) => {
        setLoading(true);
        updatePassword(props.uid, values.password).then(res => {
            if (res.code === 200) {
                message.success("修改成功");
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
            >修改密码</Button>
            <Modal
                open={open}
                title="修改密码"
                okText="确认"
                cancelText="取消"
                confirmLoading={loading}
                onCancel={() => setOpen(false)}
                onOk={() => {
                    form
                        .validateFields()
                        .then(values => {
                            changeUserPassword(values);
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
                        name="password"
                        label="密码"
                        rules={[{required: true, message: "请输入密码"}]}
                    >
                        <Input.Password maxLength={20} showCount placeholder="请输入密码"/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
