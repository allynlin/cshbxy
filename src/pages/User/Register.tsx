import React, {memo, useState} from "react";
import {Button, Form, Input, message, Radio, Select, Switch} from 'antd';
import './index-light.scss'
import Cookie from 'js-cookie';
import {useNavigate} from "react-router-dom";
import {checkUsername, findUserType, userLogin, userRegister} from "../../component/axios/api";
import {useDispatch} from "react-redux";
import {Department, Employee, Leader} from "../../component/redux/userTypeSlice";
import {login} from "../../component/redux/isLoginSlice";
import {setUser} from "../../component/redux/userInfoSlice";

const RegisterStudent = memo(() => {
    const dispatch = useDispatch();

    const [form] = Form.useForm();
    const username = Form.useWatch('username', form);
    const password = Form.useWatch('password', form);
    const enterPassword = Form.useWatch('enterPassword', form);
    const realeName = Form.useWatch('realeName', form);
    const gender = Form.useWatch('gender', form);
    const tel = Form.useWatch('tel', form);
    const email = Form.useWatch('email', form);
    const departmentUid = Form.useWatch('departmentUid', form);
    const rememberme = Form.useWatch('rememberme', form);

    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [registerType, setRegisterType] = useState('Employee');
    const [usernameUse, setUsernameUse] = useState(true);
    const navigate = useNavigate();

    const onFinish = () => {
        if (!usernameUse) {
            message.error("用户名已存在，请重新输入")
            return
        }
        if (password !== enterPassword) {
            message.error("两次密码输入不一致");
            return
        }
        userRegister(username, password, realeName, gender, tel, email, departmentUid, registerType).then(res => {
            if (res.code === 200) {
                message.success("注册成功");
                loginAutomatic();
            } else {
                message.error(res.data.msg)
            }
        })
    };

    const loginAutomatic = () => {
        if (!rememberme) {
            navigate('/login')
            return
        }
        userLogin(username, password, registerType).then(res => {
            dispatch(setUser(res.body))
            message.success(res.msg);
            isRemember()
            loginSuccess(res.body.userType)
        })
    }

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
        Cookie.set('username', username, {expires: 7, path: '/', sameSite: 'strict'});
        Cookie.set('password', password, {expires: 7, path: '/', sameSite: 'strict'});
        Cookie.set('userType', registerType, {expires: 7, path: '/', sameSite: 'strict'});
    }

    const onReset = () => {
        form.resetFields();
    };

    const checkUserName = (e: any) => {
        checkUsername(e.target.value, registerType).then(() => {
            setUsernameUse(true)
        }).catch(() => {
            setUsernameUse(false)
        })
    }


    const getDepartmentOptions = () => {
        findUserType().then(res => {
            const options = res.body.map((item: { uid: string, realeName: string }) => {
                return {
                    value: item.uid,
                    label: item.realeName
                }
            })
            setDepartmentOptions(options)
        })
    }

    // 动态渲染不同注册所需要填写的表单
    const RenderField = () => {
        return registerType === 'Employee' ? (<Form.Item
            label="部门"
            name="departmentUid"
            rules={[
                {
                    required: true,
                    message: '请选择您的上级部门',
                },
            ]}
        >
            <Select
                showSearch
                style={{
                    width: '100%',
                }}
                onFocus={getDepartmentOptions}
                placeholder="请选择你的上级部门"
                options={departmentOptions}
            />
        </Form.Item>) : null
    }

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
                gender: "男",
                rememberme: true,
            }}
        >
            <Form.Item
                wrapperCol={{}}
            >
                <Radio.Group defaultValue="Index" buttonStyle="solid" onChange={e => {
                    setRegisterType(e.target.value)
                }}>
                    <Radio.Button value="Leader">领导注册</Radio.Button>
                    <Radio.Button value="Department">部门注册</Radio.Button>
                    <Radio.Button value="Index">员工注册</Radio.Button>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                label="用户名"
                name="username"
                rules={[
                    {
                        required: true,
                        message: '请填写用户名（不超过20字符）',
                        pattern: /^[a-zA-Z0-9]{1,20}$/
                    },
                ]}
            >
                <Input showCount maxLength={20} allowClear={true} onChange={e => {
                    checkUserName(e)
                }}/>
            </Form.Item>

            <Form.Item
                label="密码"
                name="password"
                rules={[
                    {
                        required: true,
                        message: '密码必须为8-20位字母或数字',
                        pattern: /^[a-zA-Z0-9]{8,20}$/
                    },
                ]}
            >
                <Input.Password showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label="确认密码"
                name="enterPassword"
                rules={[
                    {
                        required: true,
                        message: '密码必须为8-20位字母或数字',
                        pattern: /^[a-zA-Z0-9]{8,20}$/
                    },
                ]}
            >
                <Input.Password showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label="真实姓名"
                name="realeName"
                rules={[
                    {
                        required: true,
                        message: '请输入您的真实姓名',
                        pattern: /^[\u4e00-\u9fa5]{2,4}$/
                    },
                ]}
            >
                <Input showCount maxLength={4} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label="性别"
                name="gender"
                rules={[
                    {
                        required: true,
                        message: '请选择您的性别',
                    },
                ]}
            >
                <Radio.Group buttonStyle="solid" style={{display: "flex"}}>
                    <Radio.Button value="男">男</Radio.Button>
                    <Radio.Button value="女">女</Radio.Button>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                label="联系电话"
                name="tel"
                rules={[
                    {
                        required: true,
                        message: '请输入您的联系电话',
                        pattern: /^1[3456789]\d{9}$/
                    },
                ]}
            >
                <Input type={"tel"} showCount maxLength={11} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label="电子邮件"
                name="email"
                rules={[
                    {
                        required: true,
                        message: '请输入您的电子邮件地址',
                        pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                    },
                ]}
            >
                <Input type={"email"} showCount maxLength={30} allowClear={true}/>
            </Form.Item>

            {RenderField()}

            <Form.Item
                label={"是否自动登录"}
                name='rememberme'
                valuePropName='checked'
                rules={[
                    {
                        required: true,
                        message: '请选择是否自动登录',
                    },
                ]}
            >
                <Switch style={{display: "flex"}} checkedChildren="是" unCheckedChildren="否"/>
            </Form.Item>

            <Form.Item
                wrapperCol={{}}
            >
                <Button type="primary" htmlType="submit">
                    注册
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button htmlType="button" onClick={onReset}>
                    重置
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button htmlType="button" onClick={() => {
                    navigate('/login')
                }}>
                    登录
                </Button>
            </Form.Item>
        </Form>
    )
})

const DepartmentLogin = () => (
    <RegisterStudent/>
)


export default DepartmentLogin;
