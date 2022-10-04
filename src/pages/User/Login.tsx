import React from "react";
import {Button, Form, Input, message, Switch, Radio, Layout} from 'antd';
import './index.scss'
import Cookie from 'js-cookie';
import {
    teacherLogin,
    departmentLogin,
    leaderLogin, getVersion
} from "../../component/axios/api";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {login} from "../../component/redux/isLoginSlice";
import {teacher, department, leader} from "../../component/redux/userTypeSlice";
import {version, winRe} from "../../baseInfo";
import {setVersion} from "../../component/redux/serverVersionSlice";

const {Header, Footer, Content} = Layout;

const StudentForm = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const username = Form.useWatch('username', form);
    const password = Form.useWatch('password', form);
    const channel = Form.useWatch('channel', form);
    const rememberme = Form.useWatch('rememberme', form);
    const navigate = useNavigate();

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
                name="channel"
                rules={[
                    {
                        required: true,
                        message: '必须选择登陆渠道',
                    },
                ]}
            >
                <Radio.Group style={{display: "flex"}} buttonStyle="solid">
                    <Radio.Button value="teacher">教师</Radio.Button>
                    <Radio.Button value="department">部门</Radio.Button>
                    <Radio.Button value="leader">领导</Radio.Button>
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
};

const Login = () => {

    const dispatch = useDispatch();

    const serverVersion = useSelector((state: {
        serverVersion: {
            value: string
        }
    }) => state.serverVersion.value);

    const getVer = () => {
        getVersion().then(res => {
            // 对比本地 version，如果本地版本低于服务器版本，就提示更新
            if (res.body > version) {
                message.warning("当前版本过低，请更新版本")
            }
            dispatch(setVersion(res.body))
        })
    }

    const RenderRefresh = () => {
        return (
            <a
                onClick={e => {
                    e.preventDefault();
                    getVer();
                }}>刷新</a>
        )
    }

    return (
        <Layout>
            <Header>
                <span>
                    校园 OA 系统登陆 {version}
                    <Button type={"primary"} onClick={() => {
                        // @ts-ignore
                        window.location.reload(true)
                    }}>刷新</Button>
                </span>
            </Header>
            <Content>
                <StudentForm/>
            </Content>
            <Footer style={{
                backgroundColor: serverVersion > version ? "#ff8d00" : "",
            }}>
                校园 OA 系统 &copy; 2022 Created by allynlin Version：{version} Server：{serverVersion} <RenderRefresh/>
            </Footer>
        </Layout>
    )
}

export default Login;