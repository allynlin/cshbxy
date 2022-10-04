import React, {useEffect, useState} from "react";
import './App.scss';
import routes from "./Router/routes";
import RouterWaiter from "react-router-waiter"
import {BrowserRouter} from 'react-router-dom'
import Spin from "./component/loading/Spin";
import {useSelector, useDispatch} from "react-redux";
import {message} from "antd";
import Cookie from "js-cookie";
import {checkTeacherToken, checkDepartmentToken, checkLeaderToken, getVersion} from "./component/axios/api";
import {login} from "./component/redux/isLoginSlice";
import {teacher, department, leader} from "./component/redux/userTypeSlice";
import {setVersion} from "./component/redux/serverVersionSlice";
import {version} from "./baseInfo";


function App() {
    const [isRender, setIsRender] = useState(false);

    const dispatch = useDispatch();
    const isLogin = useSelector((state: {
        isLogin: {
            value: boolean
        }
    }) => state.isLogin.value)
    const userType: String = useSelector((state: {
        userType: {
            value: String
        }
    }) => state.userType.value)

    // 页面渲染的时候，检查 cookie 中是否有 token，如果有 token，就校验 token 是否有效，如果有效可以继续执行，如果无效，就跳转到登录页面
    useEffect(() => {
        getVersion().then(res => {
            dispatch(setVersion(res.body))
        })
        switch (Cookie.get('userType')) {
            case 'teacher':
                checkTeacher()
                break
            case 'department':
                checkDepartment()
                break
            case 'leader':
                checkLeader()
                break
            default:
                checkError()
                break
        }
    }, [])

    // 检查登录状态
    const checkTeacher = () => {
        checkTeacherToken().then(res => {
            if (res.code === 200) {
                dispatch(login())
                dispatch(teacher())
                setIsRender(true)
            } else {
                message.error(res.msg)
            }
        })
    }
    const checkDepartment = () => {
        checkDepartmentToken().then(res => {
            if (res.code === 200) {
                message.success(res.msg)
                dispatch(login())
                dispatch(department())
                setIsRender(true)
            } else {
                message.error(res.msg)
            }
        })
    }
    const checkLeader = () => {
        checkLeaderToken().then(res => {
            if (res.code === 200) {
                message.success(res.msg)
                dispatch(login())
                dispatch(leader())
                setIsRender(true)
            } else {
                message.error(res.msg)
            }
        })
    }
    const checkError = () => {
        setIsRender(true)
    }

    // 路由跳转鉴权
    const onRouteBefore = ({pathname, meta}: any) => {
        // 判断是否放行，还是转到 login 页面
        // console.log('onRouteBefore', pathname, meta);
        if (meta.title !== undefined) {
            document.title = meta.title as string
        }
        if (meta.Auth === 'public')
            return pathname
        if (userType === meta.Auth)
            return pathname
        if (!isLogin) {
            message.warning('请先登录')
            return '/login'
        }
        return '/403'
    }

    return (
        isRender ? <BrowserRouter basename={process.env.PUBLIC_URL}>
            <RouterWaiter routes={routes} loading={<Spin/>} onRouteBefore={onRouteBefore}/>
        </BrowserRouter> : <Spin/>
    );
}

export default App;
