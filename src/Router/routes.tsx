import PlayOut from "../pages/Home/PlayOut";
import apply from './apply'
import record from "./record";
import approval from "./approval";
import management from "./management";
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
                path: 'employee',
                component: () => import('../pages/Index/Employee'),
                meta: {
                    title: 'Home',
                    titleCN: '员工首页',
                    Auth: 'Employee'
                }
            }, {
                path: 'department',
                component: () => import('../pages/Index/Department'),
                meta: {
                    title: 'Home',
                    titleCN: '部门首页',
                    Auth: 'Department'
                }
            }, {
                path: 'leader',
                component: () => import('../pages/Index/Leader'),
                meta: {
                    title: 'Home',
                    titleCN: '领导首页',
                    Auth: 'Leader'
                }
            }, {
                path: 'setting',
                component: () => import('../pages/Setting/Setting'),
                meta: {
                    title: 'Setting',
                    titleCN: '设置',
                }
            }, {
                path: 'success',
                element: <Success/>,
                meta: {
                    title: 'Success',
                    titleCN: '成功',
                }
            },
            ...apply,
            ...record,
            ...approval,
            ...management
        ]
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
