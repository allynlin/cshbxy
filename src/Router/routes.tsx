import PlayOut from "../pages/Home/PlayOut";
import teacherApply from './teacherApply'
import teacherRecord from "./teacherRecord";
import {RoutesItemType} from "react-router-waiter";

const routes: RoutesItemType[] = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/home',
        element: <PlayOut/>,
        meta: {
            title: '首页',
            Auth: 'public'
        },
        // 根元素使用 element 的方式导入，避免路由导航的时候刷新根元素
        children: [
            {
                path: 'teacher',
                children: [
                    {
                        path: 'index',
                        component: () => import('../pages/Index/Teacher'),
                        meta: {
                            title: '教师首页',
                            Auth: 'teacher'
                        }
                    },
                    ...teacherApply,
                    ...teacherRecord
                ]
            },
        ]
    },
    {
        path: '/login',
        component: () => import('../pages/User/Login'),
        meta: {
            title: '登录',
            Auth: 'public'
        }
    },
    {
        path: '/register',
        component: () => import('../pages/User/Register'),
        meta: {
            title: '注册',
            Auth: 'public'
        }
    },
    {
        path: '/Spin',
        component: () => import('../component/loading/Spin'),
        meta: {
            title: '正在加载中',
            Auth: 'public'
        }
    },
    {
        path: '/403',
        component: () => import('../pages/Error/403'),
        meta: {
            title: '403',
            Auth: 'public'
        }
    }, {
        path: '/404',
        component: () => import('../pages/Error/404'),
        meta: {
            title: '404',
            Auth: 'public'
        }
    },
    {
        path: '/500',
        component: () => import('../pages/Error/500'),
        meta: {
            title: '500',
            Auth: 'public'
        }
    }, {
        path: '/103',
        component: () => import('../pages/Error/VersionLow'),
        meta: {
            title: '版本过低',
            Auth: 'public'
        }
    }, {
        path: '*',
        redirect: '/404'
    }
]

export default routes