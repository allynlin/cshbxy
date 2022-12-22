import React, {useState} from "react";
import {Button, Form, Input, NavBar, Picker, Radio, Switch, Toast} from 'antd-mobile'
import {useNavigate} from "react-router-dom";
import {checkUsername, findUserType, userLogin, userRegister} from "../../component/axios/api";
import {useDispatch} from "react-redux";
import {Department, Employee, Leader} from "../../component/redux/userTypeSlice";
import {login} from "../../component/redux/isLoginSlice";
import {setUser} from "../../component/redux/userInfoSlice";
import {PickerColumn} from "antd-mobile/es/components/picker-view";
import setCookie from "../../component/cookie/setCookie";

const RegisterStudent = () => {
    const dispatch = useDispatch();

    const [form] = Form.useForm();
    const registerType = Form.useWatch('registerType', form);
    const username = Form.useWatch('username', form);
    const password = Form.useWatch('password', form);
    const enterPassword = Form.useWatch('enterPassword', form);
    const realeName = Form.useWatch('realeName', form);
    const gender = Form.useWatch('gender', form);
    const tel = Form.useWatch('tel', form);
    const email = Form.useWatch('email', form);
    const departmentUid = Form.useWatch('departmentUid', form);
    const rememberme = Form.useWatch('rememberme', form);

    const [usernameUse, setUsernameUse] = useState(true);
    const [visible, setVisible] = useState(false)
    const [columns, setColumns] = useState<PickerColumn[]>([])
    const [loading, setLoading] = useState(true)
    const [value, setValue] = useState<any>([])
    const navigate = useNavigate();

    const onFinish = () => {
        if (!usernameUse) {
            Toast.show({
                icon: 'fail',
                content: '用户名已存在'
            })
            return
        }
        if (password !== enterPassword) {
            Toast.show({
                icon: 'fail',
                content: '两次输入的密码不一致'
            })
            return
        }
        userRegister(username, password, realeName, gender, tel, email, departmentUid[0], registerType).then(res => {
            if (res.code === 200) {
                Toast.show({
                    icon: 'success',
                    content: res.msg
                })
                loginAutomatic();
            } else {
                Toast.show({
                    icon: 'fail',
                    content: res.msg
                })
            }
        })
    };

    const loginAutomatic = () => {
        if (!rememberme) {
            navigate('/m/login')
            return
        }
        userLogin(username, password, registerType).then(res => {
            dispatch(setUser(res.body))
            Toast.show({
                icon: 'success',
                content: res.msg,
            })
            isRemember()
            loginSuccess(res.body.userType)
        })
    }

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
        setCookie({name: 'cshbxy-oa-username', value: username});
        setCookie({name: 'cshbxy-oa-password', value: password});
        setCookie({name: 'cshbxy-oa-userType', value: registerType});
    }

    const onReset = () => {
        form.resetFields();
    };

    let timeOut: any;

    const checkUserName = (e: any) => {
        clearTimeout(timeOut)
        timeOut = setTimeout(() => {
            checkUsername(e, registerType).then(() => {
                setUsernameUse(true)
            }).catch(() => {
                setUsernameUse(false)
            })
        }, 500)
    }


    const handleClick = () => {
        setVisible(true)
        setLoading(true)
        findUserType().then(res => {
            const options = res.body.map((item: { uid: string, realeName: string }) => {
                return {
                    value: item.uid,
                    label: item.realeName,
                    key: item.uid
                }
            })
            setColumns([options])
            setLoading(false)
        })
    }

    // 动态渲染不同注册所需要填写的表单
    const RenderField = () => {
        return registerType === 'Employee' ? (
            <Form.Item
                label='所属部门'
                name="departmentUid"
                rules={[
                    {
                        required: true,
                        message: '请选择所属部门',
                    },
                ]}
                onClick={handleClick}
                trigger='onConfirm'
            >
                <Picker
                    loading={loading}
                    columns={columns}
                    visible={visible}
                    value={value}
                    onConfirm={v => {
                        setValue(v)
                    }}
                    onClose={() => {
                        setVisible(false)
                    }}
                >
                    {(items) => {
                        return (
                            items.every(item => item === null)
                                ? '请选择所属部门'
                                : items.map(item => item?.label ?? '请选择所属部门').join(' - ')
                        )
                    }}
                </Picker>
            </Form.Item>) : null
    }

    return (
        <>
            <NavBar onBack={() => navigate('/m/home')}>注册</NavBar>
            <Form
                form={form}
                layout='horizontal'
                footer={
                    <>
                        <Button type="submit" color="success" block>注册</Button>
                        <Button type="reset" onClick={() => onReset()} block>重置</Button>
                        <Button type="button" color="primary" onClick={() => navigate('/m/login')} block>登录</Button>
                    </>
                }
                onFinish={onFinish}
                initialValues={{
                    gender: "男",
                    rememberme: true,
                    registerType: 'Employee'
                }}
            >
                <Form.Item
                    label='注册类别'
                    name="registerType"
                >
                    <Radio.Group>
                        <Radio value="Leader">领导</Radio>
                        <Radio value="Department">部门</Radio>
                        <Radio value="Employee">员工</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label='用户名'
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名',
                            pattern: /^[a-zA-Z0-9]{1,20}$/
                        },
                    ]}
                >
                    <Input clearable placeholder={'请输入用户名'} maxLength={20} onChange={e => {
                        checkUserName(e)
                    }}/>
                </Form.Item>

                <Form.Item
                    label='密码'
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码',
                            pattern: /^[a-zA-Z0-9]{8,20}$/
                        },
                    ]}
                >
                    <Input clearable placeholder={'请输入密码'} type={'password'} maxLength={20}/>
                </Form.Item>

                <Form.Item
                    label='确认密码'
                    name="enterPassword"
                    rules={[
                        {
                            required: true,
                            message: '请再次输入密码',
                            pattern: /^[a-zA-Z0-9]{8,20}$/
                        },
                    ]}
                >
                    <Input type={'password'} placeholder={'请再次输入密码'} clearable maxLength={20}/>
                </Form.Item>

                <Form.Item
                    label='真实姓名'
                    name="realeName"
                    rules={[
                        {
                            required: true,
                            message: '请输入真实姓名',
                            pattern: /^[\u4e00-\u9fa5]{2,4}$/
                        },
                    ]}
                >
                    <Input clearable placeholder={'请输入真实姓名'} maxLength={4}/>
                </Form.Item>

                <Form.Item
                    label='性别'
                    name="gender"
                    rules={[
                        {
                            required: true,
                            message: '请选择性别',
                        },
                    ]}
                >
                    <Radio.Group>
                        <Radio value="男">男</Radio>
                        <Radio value="女">女</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label='手机号'
                    name="tel"
                    rules={[
                        {
                            required: true,
                            message: '请输入手机号',
                            pattern: /^1[3456789]\d{9}$/
                        },
                    ]}
                >
                    <Input type={"tel"} placeholder={'请输入手机号'} maxLength={11} clearable/>
                </Form.Item>

                <Form.Item
                    label='电子邮件'
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: '请输入电子邮件',
                            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                        },
                    ]}
                >
                    <Input type={"email"} placeholder={'请输入电子邮件地址'} maxLength={30} clearable/>
                </Form.Item>

                {RenderField()}

                <Form.Item
                    label='自动登录'
                    name='rememberme'
                    valuePropName='checked'
                    rules={[
                        {
                            required: true,
                            message: '请选择是否自动登录',
                        },
                    ]}
                >
                    <Switch defaultChecked={true} uncheckedText='否' checkedText='是'/>
                </Form.Item>
            </Form>
        </>
    )
}

const DepartmentLogin = () => (
    <RegisterStudent/>
)


export default DepartmentLogin;
