import React, {useState} from "react";
import {Button, Form, Input, message, Radio, Select, Switch} from 'antd';
import Cookie from 'js-cookie';
import {useNavigate} from "react-router-dom";
import {checkUsername, findUserType, userLogin, userRegister} from "../../component/axios/api";
import {useDispatch} from "react-redux";
import {Department, Employee, Leader} from "../../component/redux/userTypeSlice";
import {login} from "../../component/redux/isLoginSlice";
import {setUser} from "../../component/redux/userInfoSlice";
import intl from "react-intl-universal";

const RegisterStudent = () => {

    const [loading, setLoading] = useState<boolean>(false);

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
            message.error(intl.get('usernameIsExist'))
            return
        }
        if (password !== enterPassword) {
            message.error(intl.get('twoPasswordIsNotSame'));
            return
        }
        userRegister(username, password, realeName, gender, tel, email, departmentUid, registerType).then(res => {
            if (res.code === 200) {
                message.success(res.msg);
                loginAutomatic();
            } else {
                message.error(res.msg)
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
        Cookie.set('username', username, {expires: 7, path: '/', sameSite: 'strict'});
        Cookie.set('password', password, {expires: 7, path: '/', sameSite: 'strict'});
        Cookie.set('userType', registerType, {expires: 7, path: '/', sameSite: 'strict'});
    }

    const onReset = () => {
        form.resetFields();
    };

    let timeOut: any;

    const checkUserName = (e: any) => {
        clearTimeout(timeOut)
        timeOut = setTimeout(() => {
            checkUsername(e.target.value, registerType).then(() => {
                setUsernameUse(true)
            }).catch(() => {
                setUsernameUse(false)
            })
        }, 500)
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
            label={intl.get('department')}
            name="departmentUid"
            rules={[{
                required: true,
                message: intl.get('pleaseChooseDepartment'),
            }]}
        >
            <Select
                showSearch
                style={{
                    width: '100%',
                }}
                onFocus={getDepartmentOptions}
                placeholder={intl.get('pleaseChooseDepartment')}
                options={departmentOptions}
            />
        </Form.Item>) : null
    }

    return (
        <Form
            form={form}
            name="login"
            labelCol={{span: 8}}
            wrapperCol={{span: 8}}
            onFinish={onFinish}
            initialValues={{
                gender: "男",
                rememberme: true,
            }}
        >
            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Radio.Group defaultValue="Employee" buttonStyle="solid" onChange={e => {
                    setRegisterType(e.target.value)
                }}>
                    <Radio.Button value="Leader">{intl.get('leaderRegister')}</Radio.Button>
                    <Radio.Button value="Department">{intl.get('departmentRegister')}</Radio.Button>
                    <Radio.Button value="Employee">{intl.get('employeeRegister')}</Radio.Button>
                </Radio.Group>
            </Form.Item>

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
                <Input showCount maxLength={20} allowClear={true} onChange={e => {
                    checkUserName(e)
                }}/>
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
                        pattern: /^[\u4e00-\u9fa5]{2,4}$/
                    },
                ]}
            >
                <Input showCount maxLength={4} allowClear={true}/>
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

            {RenderField()}

            <Form.Item
                label={intl.get('autoLogin')}
                name='rememberme'
                valuePropName='checked'
                rules={[{
                    required: true,
                    message: intl.get('pleaseChooseAutoLogin'),
                }]}
            >
                <Switch style={{display: "flex"}} checkedChildren={intl.get('yes')} unCheckedChildren={intl.get('no')}/>
            </Form.Item>

            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                    {intl.get('register')}
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button htmlType="button" disabled={loading} onClick={onReset}>
                    {intl.get('reset')}
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button htmlType="button" disabled={loading} onClick={() => {
                    navigate('/login')
                }}>
                    {intl.get('login')}
                </Button>
            </Form.Item>
        </Form>
    )
}

const DepartmentLogin = () => (
    <RegisterStudent/>
)


export default DepartmentLogin;
