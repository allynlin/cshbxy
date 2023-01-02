import React, {useState} from "react";
import {App, Button, Form, Input, Radio} from 'antd';
import intl from "react-intl-universal";

import {checkUsername, userRegister} from "../../component/axios/api";
import {Employee} from "../../component/redux/userTypeSlice";


const AddUserByAdmin = () => {

    const [loading, setLoading] = useState<boolean>(false);

    const {message} = App.useApp();

    const [form] = Form.useForm();
    const username = Form.useWatch('username', form);
    const password = Form.useWatch('password', form);
    const enterPassword = Form.useWatch('enterPassword', form);
    const realeName = Form.useWatch('realeName', form);
    const gender = Form.useWatch('gender', form);
    const tel = Form.useWatch('tel', form);
    const email = Form.useWatch('email', form);
    const departmentUid = Form.useWatch('departmentUid', form);
    const userType = Form.useWatch('userType', form);

    const key = 'register'

    const onFinish = () => {
        message.open({
            key,
            type: 'loading',
            content: intl.get('checkUserNameing'),
            duration: 0,
        });
        checkUserName();
    };

    const checkUserName = () => {
        checkUsername(username, userType).then(res => {
            if (res.code !== 200) {
                message.open({
                    key,
                    type: 'error',
                    content: intl.get('usernameIsExist'),
                    duration: 3,
                });
                form.resetFields(['username']);
                return;
            }
            if (password !== enterPassword) {
                message.open({
                    key,
                    type: 'error',
                    content: intl.get('twoPasswordIsNotSame'),
                    duration: 3,
                });
                return
            }
            setLoading(true);
            register();
        }).catch(() => {
            message.open({
                key,
                type: 'error',
                content: intl.get('tryingAgain'),
                duration: 3,
            });
            checkUserName()
        });
    }

    const register = () => {
        userRegister(username, password, realeName, gender, tel, email, departmentUid, userType).then(res => {
            setLoading(false)
            if (res.code !== 200) {
                message.open({
                    key,
                    type: 'error',
                    content: res.msg,
                    duration: 3,
                });
                return
            }
            message.open({
                key,
                type: 'success',
                content: res.msg,
                duration: 3,
            });
            onReset();
        }).catch(() => {
            message.open({
                key,
                type: 'error',
                content: intl.get('tryingAgain'),
                duration: 3,
            });
            register()
        });
    }

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Form
            form={form}
            name="login"
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
                gender: "男",
                userType: "Employee",
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

            <Form.Item
                label={intl.get('userType')}
                name="userType"
                rules={[
                    {
                        required: true,
                        message: intl.get('pleaseChooseUserType'),
                    },
                ]}
            >
                <Radio.Group buttonStyle="solid">
                    <Radio.Button value="Employee">{intl.get('employee')}</Radio.Button>
                    <Radio.Button value="Leader">{intl.get('leader')}</Radio.Button>
                    <Radio.Button value="Department">{intl.get('department')}</Radio.Button>
                </Radio.Group>
            </Form.Item>


            <Form.Item>
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

const AddUser = () => (
    <App>
        <AddUserByAdmin/>
    </App>
)


export default AddUser;
