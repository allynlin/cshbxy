import apply from './apply'
import record from "./record";
import approval from "./approval";
import management from "./management";
import {Error403, Error404, Error500, Success} from "../pages/Result/Result";
import {Error404 as MobileError404,} from "../pages/Result/MobileResult";
import Home from "../pages/Home/Web";
import Mobile from "../pages/Home/Mobile";
import mobileRecord from "./mobileRecord";
import mobileApproval from "./mobileApproval";

const routes = [{
    path: '/',
    redirect: '/home'
}, {
    path: '/',
    element: <Home/>,
    meta: {
        title: 'Home',
        titleCN: '首页'
    },
    // 根元素使用 element 的方式导入，避免路由导航的时候刷新根元素
    children: [{
        path: 'home',
        component: () => import('../pages/Index/Index'),
        meta: {
            title: 'Home',
            titleCN: '首页'
        }
    }, {
        path: 'login',
        component: () => import('../pages/User/WebLogin'),
        meta: {
            title: 'Login',
            titleCN: '登录'
        }
    }, {
        path: 'register',
        component: () => import('../pages/User/AddUser'),
        meta: {
            title: 'Add User',
            titleCN: '添加用户',
            Auth: 'Department'
        }
    }, {
        path: 'departmentRegister',
        component: () => import('../pages/User/DepartmentRegister'),
        meta: {
            title: 'Add User',
            titleCN: '添加用户',
            Auth: 'Department'
        }
    }, {
        path: 'setting',
        component: () => import('../pages/Setting/Setting'),
        meta: {
            title: 'Setting',
            titleCN: '设置',
        }
    }, {
        path: 'token',
        component: () => import('../pages/Setting/Token/TokenSetting'),
        meta: {
            title: 'Token Setting',
            titleCN: 'Token设置',
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
    path: '/m',
    element: <Mobile/>,
    meta: {
        title: 'Home',
        titleCN: '首页'
    },
    children: [{
        path: 'home',
        component: () => import('../pages/Index/MobileIndex'),
        meta: {
            title: 'Home',
            titleCN: '首页'
        }
    }, {
        path: 'login-Record',
        component: () => import('../pages/Index/MobileLoginRecord'),
        meta: {
            title: 'Login Record',
            titleCN: '登录记录'
        }
    }, {
        path: 'login',
        component: () => import('../pages/User/MobileLogin'),
        meta: {
            title: 'Login',
            titleCN: '登录'
        }
    }, {
        path: 'setting',
        component: () => import('../pages/Setting/MobileSetting/MobileSetting'),
        meta: {
            title: 'Setting',
            titleCN: '设置',
        }
    }, {
        path: 'departmentUser',
        component: () => import('../pages/Management/DepartmentUser'),
        meta: {
            title: '部门用户',
            Auth: 'Department'
        }
    }, {
        path: 'userManagement',
        component: () => import('../pages/Management/UserManagement'),
        meta: {
            title: '用户管理',
            Auth: 'Department'
        }
    }, {
        path: '404',
        element: <MobileError404/>,
        meta: {
            title: '404',
        }
    }, {
        path: '*',
        redirect: '/m/404'
    },
        ...mobileRecord,
        ...mobileApproval
    ]
}, {
    path: 'loading',
    component: () => import('../pages/Setting/WaitSetting'),
    meta: {
        title: 'Loading',
        titleCN: '加载中',
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
}, {
    path: '/500',
    element: <Error500/>,
    meta: {
        title: '500'
    }
}, {
    path: '*',
    redirect: '/404'
}]

export default routes
