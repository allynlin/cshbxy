import {Button, message, Modal} from 'antd'
import {useNavigate} from "react-router-dom";
import {logout} from "../../component/redux/isLoginSlice";
import {all} from "../../component/redux/userTypeSlice";
import {useDispatch, useSelector} from "react-redux";
import Cookie from "js-cookie";
import React from "react";
import intl from "react-intl-universal";
import {ExclamationCircleOutlined, PoweroffOutlined} from "@ant-design/icons";
import {red} from "../../baseInfo";

const RenderLogOut = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLogin = useSelector((state: any) => state.isLogin.value)

    const logOut = () => {
        dispatch(logout())
        dispatch(all())
        Cookie.remove('token');
        message.success(intl.get('logOutSuccess'))
        navigate('/login', {replace: true})
    }

    const showConfirm = () => {
        Modal.confirm({
            title: intl.get('confirmLogOut'),
            icon: <ExclamationCircleOutlined/>,
            content: intl.get('afterLogOutNeedLoginAgain'),
            okText: intl.get('ok'),
            okType: 'primary',
            okButtonProps: {
                danger: true,
                style: {
                    backgroundColor: red,
                    borderColor: red
                }
            },
            cancelText: intl.get('cancel'),
            onOk() {
                logOut()
            }
        });
    }

    return (
        isLogin ?
            <Button type="primary" danger={true} icon={<PoweroffOutlined/>} onClick={showConfirm} style={{
                backgroundColor: '#f32401',
                borderColor: '#f32401'
            }}>
                {intl.get('logOut')}
            </Button> : null
    )
}

export default RenderLogOut
