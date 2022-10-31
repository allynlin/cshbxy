import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Radio, Switch} from 'antd';
import './index.scss'
import Cookie from 'js-cookie';
import {departmentLogin, leaderLogin, teacherLogin} from "../../component/axios/api";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {login} from "../../component/redux/isLoginSlice";
import {department, leader, teacher} from "../../component/redux/userTypeSlice";
import {setUser} from "../../component/redux/userInfoSlice";
import {Chinese, English} from "../../component/redux/userLanguageSlice";

const StudentForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const username = Form.useWatch('username', form);
    const password = Form.useWatch('password', form);
    const channel = Form.useWatch('channel', form);
    const rememberme = Form.useWatch('rememberme', form);

    const [isEnglish, setIsEnglish] = useState(true);

    const userLanguage: String = useSelector((state: {
        userLanguage: {
            value: 'Chinese' | 'English'
        }
    }) => state.userLanguage.value)

    useEffect(() => {
        setIsEnglish(userLanguage === 'English')
    }, [userLanguage])

    const onFinish = () => {
        switch (channel) {
            case 'teacher':
                onTeacherLogin()
                break;
            case 'department':
                onDepartmentLogin()
                break;
            case 'leader':
                onLeaderLogin()
                break;
            default:
                break;
        }
    };

    // 登录函数
    const onTeacherLogin = () => {
        teacherLogin(username, password).then(res => {
            if (res.code === 200) {
                dispatch(setUser(res.body))
                dispatch(teacher())
                message.success(res.msg);
                loginSuccess("teacher")
                isRemember()
                navigate('/home/teacher')
            } else {
                message.error(res.msg);
                loginError()
            }
        })
    }
    const onDepartmentLogin = () => {
        departmentLogin(username, password).then(res => {
            if (res.code === 200) {
                dispatch(setUser(res.body))
                dispatch(department())
                message.success(res.msg);
                loginSuccess("department")
                isRemember()
                navigate('/home/department')
            } else {
                message.error(res.msg);
                loginError()
            }
        })
    }
    const onLeaderLogin = () => {
        leaderLogin(username, password).then(res => {
            if (res.code === 200) {
                dispatch(setUser(res.body))
                dispatch(leader())
                message.success(res.msg)
                loginSuccess("leader")
                isRemember()
                navigate('/home/teacher')
            } else {
                message.error(res.msg);
                loginError()
            }
        })
    }

    // 登录成功或失败所作的操作
    const loginSuccess = (e: string) => {
        dispatch(login())
        Cookie.set('userType', e, {expires: 7, path: '/', sameSite: 'strict'})
    }
    const isRemember = () => {
        if (rememberme) {
            Cookie.set('username', username, {expires: 7, path: '/', sameSite: 'strict'});
            Cookie.set('password', password, {expires: 7, path: '/', sameSite: 'strict'});
            Cookie.set('channel', channel, {expires: 7, path: '/', sameSite: 'strict'});
        } else {
            Cookie.remove('username');
            Cookie.remove('password');
            Cookie.remove('channel');
        }
    }
    const loginError = () => {
        Cookie.remove('username');
        Cookie.remove('password');
        Cookie.remove('channel');
        Cookie.remove('userType');
    }

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Form
            form={form}
            name="login"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 8,
            }}
            onFinish={onFinish}
            initialValues={{
                username: Cookie.get("username") || "",
                password: Cookie.get("password") || "",
                rememberme: true,
                channel: Cookie.get("channel") || 'teacher',
            }}
        >
            <Form.Item
                label={isEnglish ? 'Username' : '用户名'}
                name="username"
                rules={[
                    {
                        required: true,
                        message: isEnglish ? 'Please enter your Username' : '请输入用户名',
                        pattern: /^[a-zA-Z0-9]{1,20}$/
                    },
                ]}
            >
                <Input showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label={isEnglish ? 'Password' : "密码"}
                name="password"
                rules={[
                    {
                        required: true,
                        message: isEnglish ? 'Please enter your Password' : '请输入密码',
                        pattern: /^[a-zA-Z0-9]{8,20}$/
                    },
                ]}
            >
                <Input.Password showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label={isEnglish ? 'Channel' : "登录渠道"}
                name="channel"
                rules={[
                    {
                        required: true,
                        message: isEnglish ? 'Must choose channel' : '必须选择登陆渠道',
                    },
                ]}
            >
                <Radio.Group style={{display: "flex"}} buttonStyle="solid">
                    <Radio.Button value="teacher">{isEnglish ? 'Teacher' : '教师'}</Radio.Button>
                    <Radio.Button value="department">{isEnglish ? 'Department' : '部门'}</Radio.Button>
                    <Radio.Button value="leader">{isEnglish ? 'Leader' : '领导'}</Radio.Button>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                label={isEnglish ? 'Remember me' : "记住密码"}
                name='rememberme'
                valuePropName='checked'
                rules={[
                    {
                        required: true,
                        message: isEnglish ? 'Must choose is remember me' : '必须选择是否记住密码',
                    },
                ]}
            >
                <Switch style={{display: "flex"}} checkedChildren={isEnglish ? 'Yes' : "是"}
                        unCheckedChildren={isEnglish ? 'No' : "否"}/>
            </Form.Item>

            <Form.Item
                wrapperCol={{}}
            >
                <Button type="primary" htmlType="submit">
                    {isEnglish ? 'Login' : '登录'}
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button htmlType="button" onClick={onReset}>
                    {isEnglish ? 'Reset' : '重置'}
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button htmlType="button" onClick={() => {
                    navigate('/register')
                }}>
                    {isEnglish ? 'Register' : '注册'}
                </Button>
            </Form.Item>
        </Form>
    )
};

const Login = () => (
    <StudentForm/>
)

export default Login;
