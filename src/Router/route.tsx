import React, {lazy} from 'react';
import webApply from './webApply';
import webRecord from "./webRecord";
import webApproval from "./webApproval";
import webManagement from "./webManagement";
import {Error403, Error404, Error500, Success} from "../pages/Result/Result";
import Home from "../pages/Home/Web";
import {createBrowserRouter, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

import WebSkeletonLoading from "../component/Skeleton/WebLoading";
import WebSkeleton from "../component/Skeleton/WebSkeleton";

const WebHome = lazy(() => import('../pages/Index/Index'));
const WebLogin = lazy(() => import('../pages/User/WebLogin'));
const AddUser = lazy(() => import('../pages/User/AddUser'));
const DepartmentAddUser = lazy(() => import('../pages/User/DepartmentRegister'));

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
            path: '/',
            element: <Navigate to="/home"/>,
        }, {
            path: 'home',
            element: (<RouterBefore meta={{
                title: '首页',
            }}>
                <React.Suspense fallback={<WebSkeletonLoading/>}>
                    <WebHome/>
                </React.Suspense>
            </RouterBefore>),
        }, {
            path: 'login',
            element: (<RouterBefore meta={{
                title: '登录',
            }}>
                <React.Suspense fallback={<WebSkeletonLoading/>}>
                    <WebLogin/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'register',
            element: (<RouterBefore meta={{
                title: '添加用户',
                auth: 'Department'
            }}>
                <React.Suspense fallback={<WebSkeleton/>}>
                    <AddUser/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'departmentRegister',
            element: (<RouterBefore meta={{
                title: '添加用户',
                auth: 'Department'
            }}>
                <React.Suspense fallback={<WebSkeleton/>}>
                    <DepartmentAddUser/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'success',
            element: (<RouterBefore meta={{
                title: '成功',
            }}>
                <React.Suspense fallback={<WebSkeletonLoading/>}>
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

    const isLogin = useSelector((state: any) => state.isLogin.value)
    const userType = useSelector((state: any) => state.userType.value)

    if (meta.title) {
        document.title = meta.title
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
