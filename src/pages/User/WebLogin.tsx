import React, {useEffect, useState} from "react";
import {App, Button, Form, Input, Select, Switch} from 'antd';
import Cookie from 'js-cookie';
import setCookie from "../../component/setCookie";
import {userLogin} from "../../component/axios/api";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {login} from "../../component/redux/isLoginSlice";
import {Department, Employee, Leader} from "../../component/redux/userTypeSlice";
import {setUser} from "../../component/redux/userInfoSlice";

const LoginForm = () => {

    const {message} = App.useApp();

    const key = "userLogin"

    const [loading, setLoading] = useState<boolean>(false);

    const isLogin = useSelector((state: any) => state.isLogin.value)

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const username = Form.useWatch('username', form);
    const password = Form.useWatch('password', form);
    const userType = Form.useWatch('userType', form);
    const rememberme = Form.useWatch('rememberme', form);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLogin) {
            navigate('/home', {replace: true})
        }
    }, [isLogin])

    const onFinish = () => {
        message.open({
            key,
            type: 'loading',
            content: "用户登录中",
            duration: 0,
        })
        loginUser();
    };

    const loginUser = () => {
        setLoading(true);
        userLogin(username, password, userType).then(res => {
            setLoading(false)
            if (res.code !== 200) {
                message.open({
                    key,
                    type: 'error',
                    content: res.msg,
                    duration: 3,
                })
                loginError()
                return;
            }
            message.open({
                key,
                type: 'success',
                content: res.msg,
                duration: 0.5,
            }).then(() => {
                dispatch(setUser(res.body))
                isRemember()
                loginSuccess(res.body.userType)
            })
        }).catch(() => {
            message.destroy()
            setLoading(false)
        })
    }

    // 登录成功或失败所作的操作
    const loginSuccess = (e: string) => {
        dispatch(login())
        dispatchUserType(e)
        navigate('/home')
    }

    const dispatchUserType = (e: string) => {
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
        setLoading(false);
        Cookie.remove('cshbxy-oa-username');
        Cookie.remove('cshbxy-oa-password');
        Cookie.remove('cshbxy-oa-userType');
    }

    const onReset = () => {
        Cookie.remove('cshbxy-oa-username');
        Cookie.remove('cshbxy-oa-password');
        form.resetFields();
        form.setFieldsValue({
            rememberme: true,
            username: '',
            password: ''
        })
    };

    return (
        <Form
            form={form}
            labelCol={{span: 8}}
            wrapperCol={{span: 8}}
            onFinish={onFinish}
            initialValues={{
                username: Cookie.get("cshbxy-oa-username") || "",
                password: Cookie.get("cshbxy-oa-password") || "",
                rememberme: true,
                userType: Cookie.get("cshbxy-oa-userType") || 'Employee',
            }}>
            <Form.Item
                label="用户名"
                name="username"
                rules={[{
                    required: true,
                    message: "请输入用户名"
                }]}
            >
                <Input showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label="密码"
                name="password"
                rules={[{
                    required: true,
                    message: "请输入密码"
                }]}
            >
                <Input.Password showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label="用户类型"
                name="userType"
                rules={[{
                    required: true,
                    message: "请选择用户类型"
                }]}
            >
                <Select
                    style={{width: 120}}
                    options={[
                        {value: 'Employee', label: '员工'},
                        {value: 'Leader', label: '领导'},
                        {value: 'Department', label: '管理员'},
                    ]}
                />
            </Form.Item>

            <Form.Item
                label="记住密码"
                name='rememberme'
                valuePropName='checked'
                rules={[{
                    required: true,
                    message: "请选择是否记住密码"
                }]}
            >
                <Switch style={{display: "flex"}} checkedChildren="是"
                        unCheckedChildren="否"/>
            </Form.Item>

            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                    登录
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button htmlType="button" onClick={onReset} disabled={loading}>
                    重置
                </Button>
            </Form.Item>
        </Form>
    )
}

const WebLogin = () => (
    <App>
        <LoginForm/>
    </App>
)


export default WebLogin
