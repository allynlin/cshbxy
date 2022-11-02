import PlayOut from "../pages/Home/PlayOut";
import teacherApply from './teacherApply'
import teacherRecord from "./teacherRecord";
import {RoutesItemType} from "react-router-waiter";
import {Error101, Error103, Error403, Error404, Error500, Success} from "../pages/Result/Result";
import {User} from "../pages/User";

const routes: RoutesItemType[] = [
    {
        path: '/',
        redirect: '/login'
    }, {
        path: '/',
        element: <User/>,
        meta: {
            title: 'User',
            titleCN: '用户'
        },
        children: [
            {
                path: 'login',
                component: () => import('../pages/User/Login'),
                meta: {
                    title: 'Login',
                    titleCN: '登录'
                }
            }, {
                path: 'register',
                component: () => import('../pages/User/Register'),
                meta: {
                    title: 'Register',
                    titleCN: '注册'
                }
            }
        ]
    }, {
        path: '/home',
        element: <PlayOut/>,
        meta: {
            title: 'Home',
            titleCN: '首页'
        },
        // 根元素使用 element 的方式导入，避免路由导航的时候刷新根元素
        children: [
            {
                path: 'teacher',
                component: () => import('../pages/Index/Teacher'),
                meta: {
                    title: 'Home',
                    titleCN: '教师首页',
                    Auth: 'teacher'
                }
            }
            , {
                path: 'setting',
                component: () => import('../pages/Setting/TeacherSetting'),
                meta: {
                    title: 'Setting',
                    titleCN: '设置',
                    Auth: 'teacher'
                }
            }, {
                path: 'success',
                element: <Success/>,
                meta: {
                    title: 'Success',
                    titleCN: '成功',
                    Auth: 'public'
                }
            },
            ...teacherApply,
            ...teacherRecord
        ]
    }, {
        path: '/Spin',
        component: () => import('../component/loading/Spin'),
        meta: {
            title: 'Spin',
            titleCN: '正在加载中'
        }
    }, {
        path: '/403',
        element: <Error403/>,
        meta: {
            title: '403'
        }
    }, {
        path: '/404',
        element: <Error404/>,
        meta: {
            title: '404'
        }
    },
    {
        path: '/500',
        element: <Error500/>,
        meta: {
            title: '500'
        }
    }, {
        path: '/101',
        element: <Error101/>,
        meta: {
            title: 'Version Error',
            titleCN: '版本获取失败'
        }
    }, {
        path: '/103',
        element: <Error103/>,
        meta: {
            title: 'Low Version',
            titleCN: '版本过低'
        }
    }, {
        path: '*',
        redirect: '/404'
    }
]

export default routes
