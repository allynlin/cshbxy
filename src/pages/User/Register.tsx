import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Radio, Select, Switch} from 'antd';
import './index.scss'
import Cookie from 'js-cookie';
import {useNavigate} from "react-router-dom";
import {
    departmentLogin,
    departmentRegister,
    leaderLogin,
    leaderRegister,
    queryDepartmentMessage,
    queryDepartmentUsername,
    queryLeaderMessage,
    queryLeaderUsername,
    queryTeacherUsername,
    teacherLogin,
    teacherRegister
} from "../../component/axios/api";
import {useDispatch, useSelector} from "react-redux";
import {department, leader, teacher} from "../../component/redux/userTypeSlice";
import {login} from "../../component/redux/isLoginSlice";

const RegisterStudent = () => {
    const dispatch = useDispatch();

    const [isEnglish, setIsEnglish] = useState(true);

    const userLanguage: String = useSelector((state: {
        userLanguage: {
            value: 'Chinese' | 'English'
        }
    }) => state.userLanguage.value)

    useEffect(() => {
        setIsEnglish(userLanguage === 'English')
    }, [userLanguage])

    const [form] = Form.useForm();
    const username = Form.useWatch('username', form);
    const password = Form.useWatch('password', form);
    const enterPassword = Form.useWatch('enterPassword', form);
    const realeName = Form.useWatch('realeName', form);
    const gender = Form.useWatch('gender', form);
    const tel = Form.useWatch('tel', form);
    const email = Form.useWatch('email', form);
    const departmentUid = Form.useWatch('departmentUid', form);
    const leaderUid = Form.useWatch('leaderUid', form);
    const rememberme = Form.useWatch('rememberme', form);

    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [leaderOptions, setLeaderOptions] = useState([]);
    const [registerType, setRegisterType] = useState('teacher');
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
        switch (registerType) {
            case 'teacher':
                registerTeacher()
                break
            case 'department':
                registerDepartment()
                break
            case 'leader':
                registerLeader()
                break
            default:
                message.error("系统错误，请选择正确的注册类型");
                break;
        }
    };

    const registerTeacher = () => {
        teacherRegister(username, password, realeName, gender, tel, email, departmentUid).then(res => {
            message.success(res.msg)
            loginAutomatic(registerType)
        })
    }

    const registerDepartment = () => {
        departmentRegister(username, password, realeName, gender, tel, email, leaderUid).then(res => {
            message.success(res.msg);
            loginAutomatic(registerType)
        })
    }

    const registerLeader = () => {
        leaderRegister(username, password, realeName, gender, tel, email).then(res => {
            message.success(res.msg);
            loginAutomatic(registerType)
        })
    }

    const loginAutomatic = (e: string) => {
        if (rememberme) {
            switch (e) {
                case 'teacher':
                    teacherLogin(username, password).then(res => {
                        if (res.code === 200) {
                            dispatch(teacher())
                            message.success(res.msg);
                            loginSuccess("teacher")
                            isRemember()
                            navigate('/home/teacher')
                        } else {
                            message.error(res.msg);
                            navigate('/login')
                        }
                    })
                    break
                case 'department':
                    departmentLogin(username, password).then(res => {
                        if (res.code === 200) {
                            dispatch(department())
                            message.success(res.msg);
                            loginSuccess("department")
                            isRemember()
                            navigate('/home/department')
                        } else {
                            message.error(res.msg);
                            navigate('/login')
                        }
                    })
                    break
                case 'leader':
                    leaderLogin(username, password).then(res => {
                        if (res.code === 200) {
                            dispatch(leader())
                            message.success(res.msg);
                            loginSuccess("leader")
                            isRemember()
                            navigate('/home/leader')
                        } else {
                            message.error(res.msg);
                            navigate('/login')
                        }

                    })
                    break
                default:
                    message.error("系统错误，请选择正确的注册类型");
                    break
            }
        } else {
            navigate('/login')
        }
    }

    const loginSuccess = (e: string) => {
        dispatch(login())
        Cookie.set('userType', e, {expires: 7, path: '/', sameSite: 'strict'})
    }

    const isRemember = () => {
        Cookie.set('username', username, {expires: 7, path: '/', sameSite: 'strict'});
        Cookie.set('password', password, {expires: 7, path: '/', sameSite: 'strict'});
    }

    const onReset = () => {
        form.resetFields();
    };

    const checkUsername = (e: { target: { value: String } }) => {
        switch (registerType) {
            case 'teacher':
                queryTeacherUsername(e.target.value).then(res => {
                    if (res.code !== 200) {
                        setUsernameUse(false)
                        message.error(res.msg)
                    } else {
                        setUsernameUse(true)
                    }
                })
                break;
            case 'department':
                queryDepartmentUsername(e.target.value).then(res => {
                    if (res.code !== 200) {
                        setUsernameUse(false)
                        message.error(res.msg)
                    } else {
                        setUsernameUse(true)
                    }
                })
                break;
            case 'leader':
                queryLeaderUsername(e.target.value).then(res => {
                    if (res.code !== 200) {
                        setUsernameUse(false)
                        message.error(res.msg)
                    } else {
                        setUsernameUse(true)
                    }
                })
                break;
            default:
                message.error("系统错误，请选择正确的注册类型");
                break
        }
    }


    const getDepartmentOptions = () => {
        queryDepartmentMessage().then(res => {
            const options = res.body.map((item: { uid: string, realeName: string }) => {
                return {
                    value: item.uid,
                    label: item.realeName
                }
            })
            setDepartmentOptions(options)
        })
    }

    const getLeaderOptions = () => {
        queryLeaderMessage().then(res => {
            const options: [] = res.body.map((item: { uid: string; realeName: string; }) => {
                return {
                    value: item.uid,
                    label: item.realeName
                }
            })
            setLeaderOptions(options)
        })
    }

    // 动态渲染不同注册所需要填写的表单
    const RenderField = () => {
        return registerType === 'teacher' ? (<Form.Item
            label={isEnglish ? 'Department' : "部门"}
            name="departmentUid"
            rules={[
                {
                    required: true,
                    message: isEnglish ? 'Please choose your department' : '请选择您的上级部门',
                },
            ]}
        >
            <Select
                showSearch
                style={{
                    width: '100%',
                }}
                onFocus={getDepartmentOptions}
                placeholder={isEnglish ? 'Please choose your department' : "请选择你的上级部门"}
                options={departmentOptions}
            />
        </Form.Item>) : registerType === 'department' ? (<Form.Item
            label={isEnglish ? 'Leader' : "领导"}
            name="leaderUid"
            rules={[
                {
                    required: true,
                    message: isEnglish ? 'Please choose your leader' : '请选择您的上级领导',
                },
            ]}
        >
            <Select
                showSearch
                style={{
                    width: '100%',
                }}
                placeholder={isEnglish ? 'Please choose your leader' : "请选择您的上级领导"}
                onFocus={getLeaderOptions}
                options={leaderOptions}
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
                <Radio.Group defaultValue="teacher" buttonStyle="solid" onChange={e => {
                    setRegisterType(e.target.value)
                }}>
                    <Radio.Button value="leader">{isEnglish ? 'Leader register' : '领导注册'}</Radio.Button>
                    <Radio.Button value="department">{isEnglish ? 'Department register' : '部门注册'}</Radio.Button>
                    <Radio.Button value="teacher">{isEnglish ? 'Teacher register' : '教师注册'}</Radio.Button>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                label={isEnglish ? 'Username' : "用户名"}
                name="username"
                rules={[
                    {
                        required: true,
                        message: isEnglish ? 'Please enter your username (no more than 20 characters)' : '请填写用户名（不超过20字符）',
                        pattern: /^[a-zA-Z0-9]{1,20}$/
                    },
                ]}
            >
                <Input showCount maxLength={20} allowClear={true} onChange={e => {
                    checkUsername(e)
                }}/>
            </Form.Item>

            <Form.Item
                label={isEnglish ? 'Password' : "密码"}
                name="password"
                rules={[
                    {
                        required: true,
                        message: isEnglish ? 'Password must 8-20 number or letters' : '密码必须为8-20位字母或数字',
                        pattern: /^[a-zA-Z0-9]{8,20}$/
                    },
                ]}
            >
                <Input.Password showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label={isEnglish ? 'Confirm Password' : "确认密码"}
                name="enterPassword"
                rules={[
                    {
                        required: true,
                        message: isEnglish ? 'Password must 8-20 number or letters' : '密码必须为8-20位字母或数字',
                        pattern: /^[a-zA-Z0-9]{8,20}$/
                    },
                ]}
            >
                <Input.Password showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label={isEnglish ? 'RealeName' : "真实姓名"}
                name="realeName"
                rules={[
                    {
                        required: true,
                        message: isEnglish ? 'Please enter your realeName' : '请输入您的真实姓名',
                        pattern: /^[\u4e00-\u9fa5]{2,4}$/
                    },
                ]}
            >
                <Input showCount maxLength={4} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label={isEnglish ? 'Gender' : "性别"}
                name="gender"
                rules={[
                    {
                        required: true,
                        message: isEnglish ? 'Please choose your gender' : '请选择您的性别',
                    },
                ]}
            >
                <Radio.Group buttonStyle="solid" style={{display: "flex"}}>
                    <Radio.Button value="男">{isEnglish ? 'Man' : '男'}</Radio.Button>
                    <Radio.Button value="女">{isEnglish ? 'Woman' : '女'}</Radio.Button>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                label={isEnglish ? 'Tel' : "联系电话"}
                name="tel"
                rules={[
                    {
                        required: true,
                        message: isEnglish ? 'Please enter your tel' : '请输入您的联系电话',
                        pattern: /^1[3456789]\d{9}$/
                    },
                ]}
            >
                <Input type={"tel"} showCount maxLength={11} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label={isEnglish ? 'Email' : "电子邮件"}
                name="email"
                rules={[
                    {
                        required: true,
                        message: isEnglish ? 'Please enter your email' : '请输入您的电子邮件地址',
                        pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                    },
                ]}
            >
                <Input type={"email"} showCount maxLength={30} allowClear={true}/>
            </Form.Item>

            {RenderField()}

            <Form.Item
                label={isEnglish ? 'Auto login' : "是否自动登录"}
                name='rememberme'
                valuePropName='checked'
                rules={[
                    {
                        required: true,
                        message: isEnglish ? 'Please Choose auto login' : '请选择是否自动登录',
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
                    navigate('/login')
                }}>
                    {isEnglish ? 'Login' : '登录'}
                </Button>
            </Form.Item>
        </Form>
    )
};

const DepartmentLogin = () => (
    <RegisterStudent/>
)

export default DepartmentLogin;
