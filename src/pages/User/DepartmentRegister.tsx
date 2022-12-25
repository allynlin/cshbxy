import React, {useState} from "react";
import {Button, Form, Input, message, Radio, Select} from 'antd';
import {checkUsername, findUserType, userRegister} from "../../component/axios/api";
import {Employee} from "../../component/redux/userTypeSlice";
import intl from "react-intl-universal";
import {useSelector} from "react-redux";

const RegisterStudent = () => {

    const [loading, setLoading] = useState<boolean>(false);

    const [api, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const username = Form.useWatch('username', form);
    const password = Form.useWatch('password', form);
    const enterPassword = Form.useWatch('enterPassword', form);
    const realeName = Form.useWatch('realeName', form);
    const gender = Form.useWatch('gender', form);
    const tel = Form.useWatch('tel', form);
    const email = Form.useWatch('email', form);

    const userInfo = useSelector((state: any) => state.userInfo.value);

    const onFinish = () => {
        const key = 'checkUsername'
        api.open({
            key,
            type: 'loading',
            content: intl.get('checkUserNameing'),
            duration: 0,
        });
        checkUsername(username, "Employee").then(() => {
            if (password !== enterPassword) {
                api.open({
                    key,
                    type: 'error',
                    content: intl.get('twoPasswordIsNotSame'),
                    duration: 3,
                });
                return
            }
            setLoading(true);
            userRegister(username, password, realeName, gender, tel, email, userInfo.uid, "Employee").then(res => {
                if (res.code === 200) {
                    api.open({
                        key,
                        type: 'success',
                        content: res.msg,
                        duration: 3,
                    });
                    form.resetFields();
                } else {
                    api.open({
                        key,
                        type: 'error',
                        content: res.msg,
                        duration: 3,
                    });
                }
            }).finally(() => {
                setLoading(false)
            })
        }).catch(err => {
            api.open({
                key,
                type: 'error',
                content: err.message || err.msg || intl.get('usernameIsExist'),
                duration: 3,
            });
            form.resetFields(['username']);
            return;
        })
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Form
            form={form}
            name="login"
            labelCol={{span: 8}}
            wrapperCol={{span: 8}}
            onFinish={onFinish}
            initialValues={{
                gender: "男",
            }}
        >
            {contextHolder}
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
                <Input showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label={intl.get('password')}
                name="password"
                rules={[
                    {
                        required: true,
                        message: intl.get('pleaseInputPassword'),
                        pattern: /^[a-zA-Z0-9]{8,20}$/
                    },
                ]}
            >
                <Input.Password showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label={intl.get('repeatPassword')}
                name="enterPassword"
                rules={[
                    {
                        required: true,
                        message: intl.get('pleaseRepeatPassword'),
                        pattern: /^[a-zA-Z0-9]{8,20}$/
                    },
                ]}
            >
                <Input.Password showCount maxLength={20} allowClear={true}/>
            </Form.Item>

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

            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                    {intl.get('register')}
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button htmlType="button" disabled={loading} onClick={onReset}>
                    {intl.get('reset')}
                </Button>
            </Form.Item>
        </Form>
    )
}

const DepartmentLogin = () => (
    <RegisterStudent/>
)


export default DepartmentLogin;
