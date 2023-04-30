import {App, Button, Form, Input, Modal} from 'antd';
import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {updatePassword} from "../../component/axios/api";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../component/redux/isLoginSlice";
import {all} from "../../component/redux/userTypeSlice";
import Cookie from "js-cookie";

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

const key = "updatePassword"

const UserPassword: React.FC = () => {
    const [open, setOpen] = useState(false);

    const {message} = App.useApp();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value);

    const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
                                                                           open,
                                                                           onCreate,
                                                                           onCancel,
                                                                       }) => {
        const [form] = Form.useForm();
        return (
            <Modal
                open={open}
                title="修改密码"
                okText="确认"
                cancelText="取消"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then(values => {
                            form.resetFields();
                            onCreate(values);
                        })
                        .catch(() => {
                            message.open({
                                key,
                                type: "error",
                                content: "请填写完整信息"
                            })
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
                        label="新密码"
                        rules={[{required: true, message: "请输入新密码"}]}
                    >
                        <Input.Password maxLength={20} showCount placeholder="请输入新密码"/>
                    </Form.Item>
                    <Form.Item
                        name="repeatPassword"
                        label="重复新密码"
                        rules={[{required: true, message: "请重复新密码"}]}
                    >
                        <Input.Password maxLength={20} showCount placeholder="请重复新密码"/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    const onCreate = (values: any) => {
        if (values.password !== values.repeatPassword) {
            message.open({
                key,
                type: "error",
                content: "两次密码不一致"
            })
            return
        }
        updatePassword(userInfo.uid, values.password).then(res => {
            if (res.code === 200) {
                message.open({
                    key,
                    type: "success",
                    content: "密码修改成功，请重新登录"
                })
                dispatch(logout())
                dispatch(all())
                Cookie.remove('token');
                Cookie.remove('password');
                navigate('/login', {replace: true})
            }
        }).catch(() => {
            message.destroy();
        })
        setOpen(false);
    };

    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    setOpen(true);
                    message.open({
                        key,
                        type: "warning",
                        content: "请谨慎修改密码，修改后需要重新登录"
                    })
                }}
            >
                修改密码
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

const UserPasswordSetting = () => {
    return (
        <App>
            <UserPassword/>
        </App>
    )
}

export default UserPasswordSetting;
