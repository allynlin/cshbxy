import React, {useState} from "react";
import {Button, Form, Input, message, Radio, Switch} from 'antd';
import Cookie from 'js-cookie';
import setCookie from "../../component/cookie/setCookie";
import {userLogin} from "../../component/axios/api";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {login} from "../../component/redux/isLoginSlice";
import {Department, Employee, Leader} from "../../component/redux/userTypeSlice";
import {setUser} from "../../component/redux/userInfoSlice";
import intl from "react-intl-universal";

const StudentForm = () => {

    const [loading, setLoading] = useState<boolean>(false);

    const dispatch = useDispatch();
    const [api, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const username = Form.useWatch('username', form);
    const password = Form.useWatch('password', form);
    const userType = Form.useWatch('userType', form);
    const rememberme = Form.useWatch('rememberme', form);
    const navigate = useNavigate();

    const onFinish = () => {
        setLoading(true);
        userLogin(username, password, userType).then(res => {
            dispatch(setUser(res.body))
            api.success(res.msg);
            isRemember()
            loginSuccess(res.body.userType)
        }).catch(() => {
            loginError()
        }).finally(() => {
            setLoading(false)
        })
    };

    // 登录成功或失败所作的操作
    const loginSuccess = (e: string) => {
        dispatch(login())
        switch (e) {
            case 'Employee':
                dispatch(Employee())
                navigate('/home')
                break;
            case 'Department':
                dispatch(Department())
                navigate('/home')
                break;
            case 'Leader':
                dispatch(Leader())
                navigate('/home')
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
            name="login"
            labelCol={{span: 8}}
            wrapperCol={{span: 8}}
            onFinish={onFinish}
            initialValues={{
                username: Cookie.get("cshbxy-oa-username") || "",
                password: Cookie.get("cshbxy-oa-password") || "",
                rememberme: true,
                userType: Cookie.get("cshbxy-oa-userType") || 'Employee',
            }}>
            {contextHolder}
            <Form.Item
                label={intl.get('username')}
                name="username"
                rules={[{
                    required: true,
                    message: intl.get('pleaseInputUsername'),
                }]}
            >
                <Input showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label={intl.get('password')}
                name="password"
                rules={[{
                    required: true,
                    message: intl.get('pleaseInputPassword'),
                }]}
            >
                <Input.Password showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label={intl.get('userType')}
                name="userType"
                rules={[{
                    required: true,
                    message: intl.get('pleaseChooseUserType'),
                }]}
            >
                <Radio.Group style={{display: "flex"}} buttonStyle="solid">
                    <Radio.Button value="Employee">{intl.get('employee')}</Radio.Button>
                    <Radio.Button value="Leader">{intl.get('leader')}</Radio.Button>
                    <Radio.Button value="Department">{intl.get
                    ('department')}</Radio.Button>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                label={intl.get('rememberPassword')}
                name='rememberme'
                valuePropName='checked'
                rules={[{
                    required: true,
                    message: intl.get('pleaseChooseRememberPassword'),
                }]}
            >
                <Switch style={{display: "flex"}} checkedChildren={intl.get('yes')} unCheckedChildren={intl.get('no')}/>
            </Form.Item>

            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                    {intl.get('login')}
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button htmlType="button" onClick={onReset} disabled={loading}>
                    {intl.get('reset')}
                </Button>
            </Form.Item>
        </Form>
    )
}

const Login = () => (
    <StudentForm/>
)


export default Login
