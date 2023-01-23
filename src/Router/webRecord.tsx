import React, {lazy} from "react";
import {RouterBefore} from "./route";
import WebSkeleton from "../component/Skeleton/WebSkeleton";

const DepartmentChange = lazy(() => import('../pages/Record/DepartmentChange'));
const Travel = lazy(() => import('../pages/Record/Travel'));
const Procurment = lazy(() => import('../pages/Record/Procurement'));
const Leave = lazy(() => import('../pages/Record/Leave'));
const WorkReport = lazy(() => import('../pages/Record/WorkReport'));
const Login = lazy(() => import('../pages/Index/LoginRecord'));

const record = [
    {
        path: 'departmentChange-record',
        element: (<RouterBefore meta={{
            title: 'Department Change Record',
            titleCN: '变更部门记录',
            auth: 'Employee'
        }}>
            <React.Suspense fallback={<WebSkeleton/>}>
                <DepartmentChange/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'travel-record',
        element: (<RouterBefore meta={{
            title: 'Travel Reimbursement Record',
            titleCN: '差旅报销记录',
            auth: 'Employee'
        }}>
            <React.Suspense fallback={<WebSkeleton/>}>
                <Travel/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'leave-record',
        element: (<RouterBefore meta={{
            title: 'Leave Record',
            titleCN: '请假记录',
            auth: 'Employee'
        }}>
            <React.Suspense fallback={<WebSkeleton/>}>
                <Leave/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'workReport-record',
        element: (<RouterBefore meta={{
            title: 'WorkReport Record',
            titleCN: '工作报告记录',
            auth: 'Employee'
        }}>
            <React.Suspense fallback={<WebSkeleton/>}>
                <WorkReport/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'procurement-record',
        element: (<RouterBefore meta={{
            title: 'Procurement',
            titleCN: '采购记录',
            auth: 'Employee'
        }}>
            <React.Suspense fallback={<WebSkeleton/>}>
                <Procurment/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'login-record',
        element: (<RouterBefore meta={{
            title: 'Login Record',
            titleCN: '登录记录',
        }}>
            <React.Suspense fallback={<WebSkeleton/>}>
                <Login/>
            </React.Suspense>
        </RouterBefore>)
    }
]

export default record;
