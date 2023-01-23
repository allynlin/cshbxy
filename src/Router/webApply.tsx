import React, {lazy} from "react";
import {RouterBefore} from "./route";

const DepartmentChange = lazy(() => import('../pages/Apply/DepartmentChange'));
const Travel = lazy(() => import('../pages/Apply/Travel'));
const Procurment = lazy(() => import('../pages/Apply/Procurement'));
const Leave = lazy(() => import('../pages/Apply/Leave'));
const WorkReport = lazy(() => import('../pages/Apply/WorkReport'));

const webApply = [
    {
        path: 'departmentChange-apply',
        element: (<RouterBefore meta={{
            title: 'Department Change',
            titleCN: '部门变更',
            auth: 'Employee'
        }}>
            <React.Suspense fallback={<div/>}>
                <DepartmentChange/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'travel-apply',
        element: (<RouterBefore meta={{
            title: 'Travel Reimbursement',
            titleCN: '差旅报销',
            auth: 'Employee'
        }}>
            <React.Suspense fallback={<div/>}>
                <Travel/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'procurement-apply',
        element: (<RouterBefore meta={{
            title: 'Procurement',
            titleCN: '采购',
            auth: 'Employee'
        }}>
            <React.Suspense fallback={<div/>}>
                <Procurment/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'leave-apply',
        element: (<RouterBefore meta={{
            title: 'Leave',
            titleCN: '请假',
            auth: 'Employee'
        }}>
            <React.Suspense fallback={<div/>}>
                <Leave/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'workReport-apply',
        element: (<RouterBefore meta={{
            title: 'WorkReport',
            titleCN: '工作报告',
            auth: 'Employee'
        }}>
            <React.Suspense fallback={<div/>}>
                <WorkReport/>
            </React.Suspense>
        </RouterBefore>)
    }
]

export default webApply;
