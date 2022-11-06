import {Button, message, Modal} from 'antd'
import {useNavigate} from "react-router-dom";
import {logout} from "../../component/redux/isLoginSlice";
import {all} from "../../component/redux/userTypeSlice";
import {useDispatch, useSelector} from "react-redux";
import Cookie from "js-cookie";
import React from "react";
import intl from "react-intl-universal";
import {ExclamationCircleOutlined, PoweroffOutlined} from "@ant-design/icons";

const RenderLogOut = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLogin = useSelector((state: {
        isLogin: {
            value: boolean
        }
    }) => state.isLogin.value)

    const logOut = () => {
        dispatch(logout())
        dispatch(all())
        Cookie.remove('token');
        message.success('退出成功')
        navigate('/login', {replace: true})
    }

    const showConfirm = () => {
        Modal.confirm({
            title: '确认退出吗？',
            icon: <ExclamationCircleOutlined/>,
            content: '退出后将无法继续使用系统，是否确认退出？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                logOut()
            }
        });
    }

    return (
        isLogin ?
            <Button type="primary" icon={<PoweroffOutlined/>} onClick={showConfirm} style={{
                backgroundColor: '#f32401',
                borderColor: '#f32401'
            }}>
                {intl.get('logOut')}
            </Button> : null
    )
}

export default RenderLogOut
