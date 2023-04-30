import React, {lazy} from "react";
import {RouterBefore} from "./route";
import WebSkeleton from "../component/Skeleton/WebSkeleton";

const DepartmentChange = lazy(() => import('../pages/Approval/DepartmentChange'));
const Travel = lazy(() => import('../pages/Approval/Travel'));
const Procurment = lazy(() => import('../pages/Approval/Procurement'));
const Leave = lazy(() => import('../pages/Approval/Leave'));
const WorkReport = lazy(() => import('../pages/Approval/WorkReport'));

const webApproval = [
    {
        path: 'departmentChange-approval',
        element: (<RouterBefore meta={{
            title: '部门变更',
            auth: 'Leader'
        }}>
            <React.Suspense fallback={<WebSkeleton/>}>
                <DepartmentChange/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'leave-approval',
        element: (<RouterBefore meta={{
            title: '请假',
            auth: 'Leader'
        }}>
            <React.Suspense fallback={<WebSkeleton/>}>
                <Leave/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'travel-approval',
        element: (<RouterBefore meta={{
            title: '差旅报销',
            auth: 'Leader'
        }}>
            <React.Suspense fallback={<WebSkeleton/>}>
                <Travel/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'procurement-approval',
        element: (<RouterBefore meta={{
            title: '采购',
            auth: 'Leader'
        }}>
            <React.Suspense fallback={<WebSkeleton/>}>
                <Procurment/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'workReport-approval',
        element: (<RouterBefore meta={{
            title: '工作汇报',
            auth: 'Leader'
        }}>
            <React.Suspense fallback={<WebSkeleton/>}>
                <WorkReport/>
            </React.Suspense>
        </RouterBefore>)
    }
]

export default webApproval;
