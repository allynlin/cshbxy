import React, {lazy} from "react";
import {RouterBefore} from "./route";
import WebSkeleton from "../component/Skeleton/WebSkeleton";

const DepartmentChange = lazy(() => import('../pages/Apply/DepartmentChange'));
const Travel = lazy(() => import('../pages/Apply/Travel'));
const Procurment = lazy(() => import('../pages/Apply/Procurement'));
const Leave = lazy(() => import('../pages/Apply/Leave'));
const WorkReport = lazy(() => import('../pages/Apply/WorkReport'));

const webApply = [
    {
        path: 'departmentChange-apply',
        element: (<RouterBefore meta={{
            title: '部门变更',
            auth: 'Employee'
        }}>
            <React.Suspense fallback={<WebSkeleton/>}>
                <DepartmentChange/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'travel-apply',
        element: (<RouterBefore meta={{
            title: '差旅报销',
            auth: 'Employee'
        }}>
            <React.Suspense fallback={<WebSkeleton/>}>
                <Travel/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'procurement-apply',
        element: (<RouterBefore meta={{
            title: '采购',
            auth: 'Employee'
        }}>
            <React.Suspense fallback={<WebSkeleton/>}>
                <Procurment/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'leave-apply',
        element: (<RouterBefore meta={{
            title: '请假',
            auth: 'Employee'
        }}>
            <React.Suspense fallback={<WebSkeleton/>}>
                <Leave/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'workReport-apply',
        element: (<RouterBefore meta={{
            title: '工作报告',
            auth: 'Employee'
        }}>
            <React.Suspense fallback={<WebSkeleton/>}>
                <WorkReport/>
            </React.Suspense>
        </RouterBefore>)
    }
]

export default webApply;
