import React, {useEffect, useState} from "react";
import './App-light.scss';
import routes from "./Router/routes";
import RouterWaiter from "react-router-waiter"
import Spin from "./component/loading/Spin";
import {useSelector, useDispatch} from "react-redux";
import {message} from "antd";
import Cookie from "js-cookie";
import {checkTeacherToken, checkDepartmentToken, checkLeaderToken, getVersion} from "./component/axios/api";
import {login} from "./component/redux/isLoginSlice";
import {teacher, department, leader} from "./component/redux/userTypeSlice";
import {setVersion} from "./component/redux/serverVersionSlice";
import {unstable_HistoryRouter as HistoryRouter} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import {dark, light} from "./component/redux/themeSlice";

const history = createBrowserHistory({window});

export const rootNavigate = (to: string) => {
    history.push(`${process.env.PUBLIC_URL}${to}`)
};


function App() {
    const [isRender, setIsRender] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        // 检测当前是深色还是浅色模式
        dispatch(isDark ? dark() : light());
    }, [])

    // 当用户更改系统主题时，更新redux中的主题
    useEffect(() => {
        const listener = (e: MediaQueryListEvent) => {
            dispatch(e.matches ? dark() : light());
        };
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);
        return () => {
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
        };
    }, []);

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
        if (!isRender) return false
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
        <HistoryRouter basename={process.env.PUBLIC_URL} history={history}>
            <RouterWaiter routes={routes} loading={<Spin/>} onRouteBefore={onRouteBefore}/>
        </HistoryRouter>
    );
}

export default App;
