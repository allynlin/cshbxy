import React from "react";
import {Button, Form, Input, message, Radio, Switch} from 'antd';
import './index.scss'
import Cookie from 'js-cookie';
import {userLogin} from "../../component/axios/api";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {login} from "../../component/redux/isLoginSlice";
import {Department, Employee, Leader} from "../../component/redux/userTypeSlice";
import {setUser} from "../../component/redux/userInfoSlice";
import intl from "react-intl-universal";

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
        }
    }

    const loginError = () => {
        Cookie.remove('username');
        Cookie.remove('password');
        Cookie.remove('userType');
    }

    const onReset = () => {
        Cookie.remove('username');
        Cookie.remove('password');
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
                label={intl.get('userType')}
                name="userType"
                rules={[
                    {
                        required: true,
                        message: intl.get('pleaseChooseUserType'),
                    },
                ]}
            >
                <Radio.Group style={{display: "flex"}} buttonStyle="solid">
                    <Radio.Button value="Employee">{intl.get('employee')}</Radio.Button>
                    <Radio.Button value="Department">{intl.get
                    ('department')}</Radio.Button>
                    <Radio.Button value="Leader">{intl.get('leader')}</Radio.Button>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                label={intl.get('rememberPassword')}
                name='rememberme'
                valuePropName='checked'
                rules={[
                    {
                        required: true,
                        message: intl.get('pleaseChooseRememberPassword'),
                    },
                ]}
            >
                <Switch style={{display: "flex"}} checkedChildren={intl.get('yes')} unCheckedChildren={intl.get('no')}/>
            </Form.Item>

            <Form.Item
                wrapperCol={{}}
            >
                <Button type="primary" htmlType="submit">
                    {intl.get('login')}
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button htmlType="button" onClick={onReset}>
                    {intl.get('reset')}
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button htmlType="button" onClick={() => {
                    navigate('/register')
                }}>
                    {intl.get('register')}
                </Button>
            </Form.Item>
        </Form>
    )
}

const Login = () => (
    <StudentForm/>
)


export default Login
