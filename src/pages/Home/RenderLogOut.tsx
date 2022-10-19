import {Button} from 'antd'
import {useNavigate} from "react-router-dom";
import {logout} from "../../component/redux/isLoginSlice";
import {all} from "../../component/redux/userTypeSlice";
import {useDispatch, useSelector} from "react-redux";
import Cookie from "js-cookie";
import {useEffect, useState} from "react";

const RenderLogOut = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isEnglish, setIsEnglish] = useState(true);

    const userLanguage: String = useSelector((state: {
        userLanguage: {
            value: 'Chinese' | 'English'
        }
    }) => state.userLanguage.value)

    useEffect(() => {
        setIsEnglish(userLanguage === 'English')
    }, [userLanguage])

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
                {isEnglish ? 'LogOut' : '退出登录'}
            </Button> : null
    )
}

export default RenderLogOut
