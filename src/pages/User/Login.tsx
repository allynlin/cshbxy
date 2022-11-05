import React, {memo} from "react";
import {Button, Form, Input, message, Switch, Radio} from 'antd';
import './index-light.scss'
import Cookie from 'js-cookie';
import {userLogin} from "../../component/axios/api";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {login} from "../../component/redux/isLoginSlice";
import {Employee, Department, Leader} from "../../component/redux/userTypeSlice";
import {setUser} from "../../component/redux/userInfoSlice";

const StudentForm = memo(() => {
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
            message.success(res.msg);
            isRemember()
            loginSuccess(res.body.userType)
        }).catch(() => {
            loginError()
        })
    };

    // 登录成功或失败所作的操作
    const loginSuccess = (e: string) => {
        dispatch(login())
        Cookie.set('userType', e, {expires: 7, path: '/', sameSite: 'strict'})
        switch (e) {
            case 'Employee':
                dispatch(Employee())
                navigate('/home/employee')
                break;
            case 'Department':
                dispatch(Department())
                navigate('/home/department')
                break;
            case 'Leader':
                dispatch(Leader())
                navigate('/home/leader')
                break;
        }
    }

    const isRemember = () => {
        if (rememberme) {
            Cookie.set('username', username, {expires: 7, path: '/', sameSite: 'strict'});
            Cookie.set('password', password, {expires: 7, path: '/', sameSite: 'strict'});
            Cookie.set('userType', userType, {expires: 7, path: '/', sameSite: 'strict'});
        } else {
            Cookie.remove('username');
            Cookie.remove('password');
            Cookie.remove('userType');
        }
    }

    const loginError = () => {
        Cookie.remove('username');
        Cookie.remove('password');
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
                userType: Cookie.get("userType") || 'Employee',
            }}
        >
            <Form.Item
                label="用户名"
                name="username"
                rules={[
                    {
                        required: true,
                        message: '请输入用户名',
                        pattern: /^[a-zA-Z0-9]{1,20}$/
                    },
                ]}
            >
                <Input showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label="密码"
                name="password"
                rules={[
                    {
                        required: true,
                        message: '请输入密码',
                        pattern: /^[a-zA-Z0-9]{8,20}$/
                    },
                ]}
            >
                <Input.Password showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label="登录渠道"
                name="userType"
                rules={[
                    {
                        required: true,
                        message: '必须选择登陆渠道',
                    },
                ]}
            >
                <Radio.Group style={{display: "flex"}} buttonStyle="solid">
                    <Radio.Button value="Employee">员工</Radio.Button>
                    <Radio.Button value="Department">部门</Radio.Button>
                    <Radio.Button value="Leader">领导</Radio.Button>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                label="记住密码"
                name='rememberme'
                valuePropName='checked'
                rules={[
                    {
                        required: true,
                        message: '必须选择是否记住密码',
                    },
                ]}
            >
                <Switch style={{display: "flex"}} checkedChildren="是" unCheckedChildren="否"/>
            </Form.Item>

            <Form.Item
                wrapperCol={{}}
            >
                <Button type="primary" htmlType="submit">
                    登录
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button htmlType="button" onClick={onReset}>
                    重置
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button htmlType="button" onClick={() => {
                    navigate('/register')
                }}>
                    注册
                </Button>
            </Form.Item>
        </Form>
    )
})

const Login = () => (
    <StudentForm/>
)


export default Login
