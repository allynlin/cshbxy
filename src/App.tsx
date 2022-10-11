import React, {useEffect, useState} from "react";
import './App-light.scss';
import routes from "./Router/routes";
import RouterWaiter from "react-router-waiter"
import Spin from "./component/loading/Spin";
import {useSelector, useDispatch} from "react-redux";
import {message} from "antd";
import Cookie from "js-cookie";
import {checkTeacherToken, checkDepartmentToken, checkLeaderToken, getVersion} from "./component/axios/api";
import {login, logout} from "./component/redux/isLoginSlice";
import {teacher, department, leader, all} from "./component/redux/userTypeSlice";
import {setVersion} from "./component/redux/serverVersionSlice";
import {unstable_HistoryRouter as HistoryRouter, useNavigate} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import {darkTheme, lightTheme, sysTheme} from "./component/redux/sysColorSlice";
import {light, dark} from "./component/redux/themeSlice";
import {LStorage} from "./component/localStrong";
import {inline, vertical} from "./component/redux/menuModeSlice";

const history = createBrowserHistory({window});

export const rootNavigate = (to: string) => {
    history.push(`${process.env.PUBLIC_URL}${to}`)
};


function App() {
    const [isRender, setIsRender] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        LStorage.get('menuMode') === 'inline' ? dispatch(inline()) : dispatch(vertical())
        // 如果在 localStrong 中有颜色设置就使用 localStrong 中的颜色设置
        const sysColor = LStorage.get('themeColor');
        switch (sysColor) {
            case 'light':
                dispatch(lightTheme());
                break;
            case 'dark':
                dispatch(darkTheme());
                break;
            case 'sys':
                dispatch(sysTheme());
                break;
            default:
                dispatch(lightTheme());
        }
    }, [])

    const sysColor: String = useSelector((state: {
        sysColor: {
            value: 'light' | 'dark' | 'sys'
        }
    }) => state.sysColor.value)

    // 当 themeColor 为 sys 时，根据系统颜色设置主题颜色
    useEffect(() => {
        switch (sysColor) {
            case 'sys':
                const themeColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                dispatch(themeColor === 'dark' ? dark() : light());
                // 监听系统颜色变化
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                    dispatch(e.matches ? dark() : light());
                })
                break;
            case 'light':
                dispatch(light());
                break;
            case 'dark':
                dispatch(dark());
                break;
        }
    }, [sysColor])

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
