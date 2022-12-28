import React from "react";
import Cookie from 'js-cookie';
import setCookie from "../../component/setCookie";
import {userLogin} from "../../component/axios/api";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {login} from "../../component/redux/isLoginSlice";
import {Department, Employee, Leader} from "../../component/redux/userTypeSlice";
import {setUser} from "../../component/redux/userInfoSlice";
import {Button, Form, Input, NavBar, Radio, Switch, Toast} from 'antd-mobile'

const StudentForm = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const username = Form.useWatch('username', form);
    const password = Form.useWatch('password', form);
    const userType = Form.useWatch('userType', form);
    const rememberme = Form.useWatch('rememberme', form);
    const navigate = useNavigate();

    const onFinish = () => {
        userLogin(username, password, userType).then(res => {
            dispatch(setUser(res.body))
            Toast.show({
                content: res.msg,
                icon: 'success',
            })
            isRemember()
            loginSuccess(res.body.userType)
        }).catch(() => {
            loginError()
        })
    };

    // 登录成功或失败所作的操作
    const loginSuccess = (e: string) => {
        dispatch(login())
        switch (e) {
            case 'Employee':
                dispatch(Employee())
                break;
            case 'Department':
                dispatch(Department())
                break;
            case 'Leader':
                dispatch(Leader())
                break;
        }
        navigate('/m/home')
    }

    const isRemember = () => {
        if (rememberme) {
            setCookie({name: 'cshbxy-oa-username', value: username});
            setCookie({name: 'cshbxy-oa-password', value: password});
            setCookie({name: 'cshbxy-oa-userType', value: userType});
        } else {
            Cookie.remove('cshbxy-oa-username');
            Cookie.remove('cshbxy-oa-password');
        }
    }

    const loginError = () => {
        Cookie.remove('cshbxy-oa-username');
        Cookie.remove('cshbxy-oa-password');
        Cookie.remove('cshbxy-oa-userType');
    }

    const onReset = () => {
        Cookie.remove('cshbxy-oa-username');
        Cookie.remove('cshbxy-oa-password');
        Cookie.remove('cshbxy-oa-userType');
        form.resetFields();
    };

    return (
        <>
            <NavBar onBack={() => navigate('/m/home')}>登录</NavBar>
            <Form
                form={form}
                layout='horizontal'
                footer={
                    <>
                        <Button type="submit" color="success" block>登录</Button>&nbsp;
                        <Button type="reset" onClick={() => onReset()} block>重置</Button>
                    </>
                }
                onFinish={onFinish}
                initialValues={{
                    username: Cookie.get("cshbxy-oa-username") || "",
                    password: Cookie.get("cshbxy-oa-password") || "",
                    rememberme: 'true',
                    userType: Cookie.get("cshbxy-oa-userType") || 'Employee',
                }}
            >
                <Form.Item
                    label='用户名'
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名'
                        },
                    ]}
                >
                    <Input clearable placeholder={'请输入用户名'}/>
                </Form.Item>

                <Form.Item
                    label='密码'
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码',
                            pattern: /^[a-zA-Z0-9]/
                        },
                    ]}
                >
                    <Input type={'password'} clearable placeholder={'请输入密码'}/>
                </Form.Item>

                <Form.Item
                    label='用户类型'
                    name="userType"
                    rules={[
                        {
                            required: true,
                            message: '请选择用户类型'
                        },
                    ]}
                >
                    <Radio.Group>
                        <Radio value="Employee">员工</Radio>
                        <Radio value="Leader">领导</Radio>
                        <Radio value="Department">管理员</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label='记住密码'
                    name='rememberme'
                    rules={[
                        {
                            required: true,
                            message: '请选择是否记住密码'
                        },
                    ]}
                >
                    <Switch defaultChecked={true} uncheckedText='否' checkedText='是'/>
                </Form.Item>
            </Form>
        </>
    )
}

const Login = () => (
    <StudentForm/>
)


export default Login
