import {App, Avatar, Button} from 'antd'
import {useNavigate} from "react-router-dom";
import {logout} from "../../component/redux/isLoginSlice";
import {all} from "../../component/redux/userTypeSlice";
import {useDispatch, useSelector} from "react-redux";
import Cookie from "js-cookie";
import intl from "react-intl-universal";
import {ExclamationCircleOutlined, LoginOutlined, UserOutlined} from "@ant-design/icons";
import {useGaussianBlurStyles} from "../../styles/gaussianBlurStyle";


const RenderLogOut = () => {

    const { message, modal } = App.useApp();

    const classes = useGaussianBlurStyles();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLogin = useSelector((state: any) => state.isLogin.value)
    const userToken = useSelector((state: any) => state.userToken.value)
    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value)

    const logOut = () => {
        dispatch(logout())
        dispatch(all())
        Cookie.remove('cshbxy-oa-token');
        message.success(intl.get('logOutSuccess'))
        navigate('/login', { replace: true })
    }

    const navigateToLogin = () => {
        navigate('/login', { replace: true })
    }

    const showLogOutConfirm = () => {
        modal.confirm({
            title: intl.get('confirmLogOut'),
            icon: <ExclamationCircleOutlined />,
            content: intl.get('afterLogOutNeedLoginAgain'),
            okText: intl.get('ok'),
            okType: 'primary',
            mask: !gaussianBlur,
            className: gaussianBlur ? classes.gaussianBlurModalMethod : '',
            okButtonProps: {
                danger: true,
                style: {
                    backgroundColor: userToken.errorColor,
                    borderColor: userToken.errorColor,
                },
            },
            cancelText: intl.get('cancel'),
            onOk() {
                logOut()
            }
        })
    }

    return (
        isLogin ? <Avatar shape="square" size="large" icon={<UserOutlined />} onClick={showLogOutConfirm} /> :
            <Button
                type="primary"
                icon={<LoginOutlined />}
                onClick={navigateToLogin}>
                {intl.get('login')}
            </Button>
    )
}

const MyApp = () => {
    return (
        <App>
            <RenderLogOut />
        </App>
    )
}

export default MyApp
