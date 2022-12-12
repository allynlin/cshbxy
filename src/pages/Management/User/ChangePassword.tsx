import React, {useState} from "react";
import {Button, Form, Input, message, Modal} from "antd";
import {purple} from "../../../baseInfo";
import intl from "react-intl-universal";
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
                message.success(intl.get('changeSuccess'));
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
                style={{backgroundColor: purple, borderColor: purple}}
                onClick={() => {
                    setOpen(true);
                }}
            >
                {intl.get('changePassword')}
            </Button>
            <Modal
                open={open}
                title={intl.get("changeUsername")}
                okText={intl.get('ok')}
                cancelText={intl.get('cancel')}
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
                        name={'password'}
                        label={intl.get("password")}
                        rules={[{required: true, message: intl.get('pleaseInputPassword')}]}
                    >
                        <Input.Password maxLength={20} showCount placeholder={intl.get('pleaseInputPassword')}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
