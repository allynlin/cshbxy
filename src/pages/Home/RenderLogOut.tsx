import {Button} from 'antd'
import {useNavigate} from "react-router-dom";
import {logout} from "../../component/redux/isLoginSlice";
import {all} from "../../component/redux/userTypeSlice";
import {useDispatch} from "react-redux";
import Cookie from "js-cookie";

const RenderLogOut = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logOut = () => {
        dispatch(logout())
        dispatch(all())
        Cookie.remove('token');
        Cookie.remove('userType');
        navigate('/login', {replace: true})
    }

    return (
        <Button type="primary" onClick={logOut} style={{
            backgroundColor: '#f32401',
            borderColor: '#f32401'
        }}>
            退出登录
        </Button>
    )
}

export default RenderLogOut