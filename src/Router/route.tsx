import React, {lazy} from 'react';
import webApply from './webApply';
import webRecord from "./webRecord";
import webApproval from "./webApproval";
import webManagement from "./webManagement";
import {Error403, Error404, Error500, Success} from "../pages/Result/Result";
import {Error404 as MobileError404,} from "../pages/Result/MobileResult";
import Home from "../pages/Home/Web";
import Mobile from "../pages/Home/Mobile";
import mobileRecord from "./mobileRecord";
import mobileApproval from "./mobileApproval";
import {createBrowserRouter, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

const WebHome = lazy(() => import('../pages/Index/Index'));
const WebLogin = lazy(() => import('../pages/User/WebLogin'));
const AddUser = lazy(() => import('../pages/User/AddUser'));
const DepartmentAddUser = lazy(() => import('../pages/User/DepartmentRegister'));
const WebSetting = lazy(() => import('../pages/Setting/Setting'));
const WebToken = lazy(() => import('../pages/Setting/Token/TokenSetting'));

const MobileHome = lazy(() => import('../pages/Index/MobileIndex'));
const MobileLoginRecord = lazy(() => import('../pages/Index/MobileLoginRecord'));
const MobileLogin = lazy(() => import('../pages/User/MobileLogin'));
const MobileSetting = lazy(() => import('../pages/Setting/MobileSetting/MobileSetting'));
const MobileDepartmentUser = lazy(() => import('../pages/Management/DepartmentUser'));
const MobileUserManagement = lazy(() => import('../pages/Management/UserManagement'));


const WebLoading = lazy(() => import('../pages/Setting/WaitSetting'));

interface metaProps {
    title?: string,
    titleCN?: string,
    auth?: string
}

const routes = [
    {
        path: '/',
        element: <Home/>,
        children: [{
            path: 'home',
            element: (<RouterBefore meta={{
                title: 'Home',
                titleCN: '首页'
            }}>
                <React.Suspense fallback={<div/>}>
                    <WebHome/>
                </React.Suspense>
            </RouterBefore>),
        }, {
            path: 'login',
            element: (<RouterBefore meta={{
                title: 'Login',
                titleCN: '登录'
            }}>
                <React.Suspense fallback={<div/>}>
                    <WebLogin/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'register',
            element: (<RouterBefore meta={{
                title: 'Add User',
                titleCN: '添加用户',
                auth: 'Department'
            }}>
                <React.Suspense fallback={<div/>}>
                    <AddUser/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'departmentRegister',
            element: (<RouterBefore meta={{
                title: 'Add User',
                titleCN: '添加用户',
                auth: 'Department'
            }}>
                <React.Suspense fallback={<div/>}>
                    <DepartmentAddUser/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'setting',
            element: (<RouterBefore meta={{
                title: 'Setting',
                titleCN: '设置'
            }}>
                <React.Suspense fallback={<div/>}>
                    <WebSetting/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'token',
            element: (<RouterBefore meta={{
                title: 'Token Setting',
                titleCN: 'Token设置'
            }}>
                <React.Suspense fallback={<div/>}>
                    <WebToken/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'success',
            element: (<RouterBefore meta={{
                title: 'Success',
                titleCN: '成功'
            }}>
                <React.Suspense fallback={<div/>}>
                    <Success/>
                </React.Suspense>
            </RouterBefore>)
        },
            ...webApply,
            ...webRecord,
            ...webApproval,
            ...webManagement
        ]
    }, {
        path: 'm',
        element: (<RouterBefore meta={{
            title: 'Home',
            titleCN: '首页'
        }}>
            <Mobile/>
        </RouterBefore>),
        children: [{
            path: 'home',
            element: (<RouterBefore meta={{
                title: 'Home',
                titleCN: '首页'
            }}>
                <React.Suspense fallback={<div/>}>
                    <MobileHome/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'login-Record',
            element: (<RouterBefore meta={{
                title: 'Login Record',
                titleCN: '登录记录'
            }}>
                <React.Suspense fallback={<div/>}>
                    <MobileLoginRecord/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'login',
            element: (<RouterBefore meta={{
                title: 'Login',
                titleCN: '登录'
            }}>
                <React.Suspense fallback={<div/>}>
                    <MobileLogin/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'setting',
            element: (<RouterBefore meta={{
                title: 'Setting',
                titleCN: '设置',
            }}>
                <React.Suspense fallback={<div/>}>
                    <MobileSetting/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'departmentUser',
            element: (<RouterBefore meta={{
                title: '部门用户',
                auth: 'Department'
            }}>
                <React.Suspense fallback={<div/>}>
                    <MobileDepartmentUser/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'userManagement',
            element: (<RouterBefore meta={{
                title: '用户管理',
                auth: 'Department'
            }}>
                <React.Suspense fallback={<div/>}>
                    <MobileUserManagement/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: '404',
            element: (
                <RouterBefore meta={{
                    title: '404'
                }}>
                    <MobileError404/>
                </RouterBefore>
            )
        }, {
            path: '*',
            element: <Navigate to="/m/404"/>
        },
            ...mobileApproval,
            ...mobileRecord
        ]
    }, {
        path: 'loading',
        element: (
            <RouterBefore meta={{
                title: 'Loading',
                titleCN: '加载中',
            }}>
                <React.Suspense fallback={<div/>}>
                    <WebLoading/>
                </React.Suspense>
            </RouterBefore>
        )
    }, {
        path: '403',
        element: (
            <RouterBefore meta={{
                title: '403'
            }}>
                <Error403/>
            </RouterBefore>
        )
    }, {
        path: '404',
        element: (
            <RouterBefore meta={{
                title: '404'
            }}>
                <Error404/>
            </RouterBefore>
        )
    }, {
        path: '500',
        element: (
            <RouterBefore meta={{
                title: '500'
            }}>
                <Error500/>
            </RouterBefore>
        )
    }, {
        path: '*',
        element: <Navigate to="/404"/>
    }
]

const router = createBrowserRouter(routes, {
    basename: process.env.PUBLIC_URL
});

// 路由跳转前操作
export function RouterBefore({children, meta = {}}: { children: JSX.Element, meta?: metaProps }) {

    const userLanguage = useSelector((state: any) => state.userLanguage.value)
    const isLogin = useSelector((state: any) => state.isLogin.value)
    const userType = useSelector((state: any) => state.userType.value)

    if (meta.title) {
        // 设置页面标题，如果中文标题不存在，就直接使用英文标题代替，否之就判断当前用户语言，根据用户语言判断是使用中文标题还是英文标题
        if (meta.titleCN === undefined) {
            document.title = meta.title
        } else {
            userLanguage === 'English' ? document.title = meta.title : document.title = meta.titleCN
        }
    }
    if (meta.auth) {
        if (userType === meta.auth)
            return children
        if (!isLogin) {
            return <Navigate to="/login" replace/>
        }
        return <Navigate to="/403" replace/>
    }
    return children
}

export default router
