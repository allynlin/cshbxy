import apply from './apply'
import record from "./record";
import approval from "./approval";
import management from "./management";
import {Error101, Error103, Error403, Error404, Error500, Success} from "../pages/Result/Result";
import {
    Error404 as MobileError404,
    Error403 as MobileError403,
    Error500 as MobileError500,
} from "../pages/Result/MobileResult";
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
        component: () => import('../pages/User/Login'),
        meta: {
            title: 'Login',
            titleCN: '登录'
        }
    }, {
        path: 'register',
        component: () => import('../pages/User/Register'),
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
        path: 'login',
        component: () => import('../pages/User/MobileLogin'),
        meta: {
            title: 'Login',
            titleCN: '登录'
        }
    }, {
        path: 'register',
        component: () => import('../pages/User/MobileRegister'),
        meta: {
            title: 'Register',
            titleCN: '注册'
        }
    }, {
        path: 'setting',
        component: () => import('../pages/Setting/MobileSetting'),
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
            Auth: 'Leader'
        }
    }, {
        path: '404',
        element: <MobileError404/>,
        meta: {
            title: '404',
        }
    }, {
        path: '403',
        element: <MobileError403/>,
        meta: {
            title: '403',
        }
    }, {
        path: '500',
        element: <MobileError500/>,
        meta: {
            title: '500',
        }
    }, {
        path: '*',
        redirect: '/m/404'
    },
        ...mobileRecord,
        ...mobileApproval
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
}, {
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
}]

export default routes
