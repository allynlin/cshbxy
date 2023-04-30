import {App, Button} from 'antd'
import {useNavigate} from "react-router-dom";
import {logout} from "../../component/redux/isLoginSlice";
import {all} from "../../component/redux/userTypeSlice";
import {useDispatch, useSelector} from "react-redux";
import Cookie from "js-cookie";
import {ExclamationCircleOutlined, LoginOutlined, PoweroffOutlined} from "@ant-design/icons";
import {LStorage, SStorage} from "../../component/localStrong";
import UserPasswordSetting from "../Setting/UserPasswordSetting";
import React from "react";


const RenderLogOut = () => {

    const {message, modal} = App.useApp();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLogin = useSelector((state: any) => state.isLogin.value)

    const logOut = () => {
        dispatch(logout())
        dispatch(all())
        Cookie.remove('cshbxy-oa-token');
        SStorage.clear()
        LStorage.delete('setting')
        message.success("退出成功")
        navigate('/login', {replace: true})
    }

    const navigateToLogin = () => {
        navigate('/login', {replace: true})
    }

    const showLogOutConfirm = () => {
        modal.confirm({
            title: "确认退出登录",
            icon: <ExclamationCircleOutlined/>,
            content: "退出后需要重新登录",
            okText: "确定",
            okType: 'primary',
            okButtonProps: {
                danger: true,
            },
            cancelText: '取消',
            onOk() {
                logOut()
            }
        })
    }

    return (
        isLogin ? <div style={{display: "flex"}}>
                <UserPasswordSetting/>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button
                    type="primary"
                    icon={<PoweroffOutlined/>}
                    onClick={showLogOutConfirm}
                    danger
                >
                    退出登录
                </Button></div> :
            <Button
                type="primary"
                icon={<LoginOutlined/>}
                onClick={navigateToLogin}>
                登录
            </Button>
    )
}

const MyApp = () => {
    return (
        <App>
            <RenderLogOut/>
        </App>
    )
}

export default MyApp
