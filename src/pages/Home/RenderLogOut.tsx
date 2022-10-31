import {Button} from 'antd'
import {useNavigate} from "react-router-dom";
import {logout} from "../../component/redux/isLoginSlice";
import {all} from "../../component/redux/userTypeSlice";
import {useDispatch, useSelector} from "react-redux";
import Cookie from "js-cookie";
import React from "react";
import intl from "react-intl-universal";

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
        Cookie.remove('userType');
        navigate('/login', {replace: true})
    }

    return (
        isLogin ?
            <Button type="primary" onClick={logOut} style={{
                backgroundColor: '#f32401',
                borderColor: '#f32401'
            }}>
                {intl.get('logOut')}
            </Button> : null
    )
}

export default RenderLogOut
