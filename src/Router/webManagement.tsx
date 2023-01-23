import React, {lazy} from "react";
import {RouterBefore} from "./route";
import WebSkeleton from "../component/Skeleton/WebSkeleton";

const User = lazy(() => import('../pages/Management/User/UserManagement'));
const Department = lazy(() => import('../pages/Management/User/DepartmentUser'));
const Process = lazy(() => import('../pages/Management/Process'));

const webManagement = [
    {
        path: 'user-management',
        element: (<RouterBefore meta={{
            title: 'User management',
            titleCN: '用户管理',
            auth: 'Department'
        }}>
            <React.Suspense fallback={<WebSkeleton/>}>
                <User/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'departmentUser-management',
        element: (<RouterBefore meta={{
            title: 'Department user',
            titleCN: '部门用户',
            auth: 'Department'
        }}>
            <React.Suspense fallback={<WebSkeleton/>}>
                <Department/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'process-management',
        element: (<RouterBefore meta={{
            title: 'Process management',
            titleCN: '流程管理',
            auth: 'Department'
        }}>
            <React.Suspense fallback={<WebSkeleton/>}>
                <Process/>
            </React.Suspense>
        </RouterBefore>)
    }
]

export default webManagement;
