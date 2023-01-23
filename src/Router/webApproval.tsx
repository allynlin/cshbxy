import React, {lazy} from "react";
import {RouterBefore} from "./route";

const DepartmentChange = lazy(() => import('../pages/Approval/DepartmentChange'));
const Travel = lazy(() => import('../pages/Approval/Travel'));
const Procurment = lazy(() => import('../pages/Approval/Procurement'));
const Leave = lazy(() => import('../pages/Approval/Leave'));
const WorkReport = lazy(() => import('../pages/Approval/WorkReport'));

const webApproval = [
    {
        path: 'departmentChange-approval',
        element: (<RouterBefore meta={{
            title: 'Approval Department Change',
            titleCN: '部门变更',
            auth: 'Leader'
        }}>
            <React.Suspense fallback={<div/>}>
                <DepartmentChange/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'leave-approval',
        element: (<RouterBefore meta={{
            title: 'Approval Leave',
            titleCN: '请假',
            auth: 'Leader'
        }}>
            <React.Suspense fallback={<div/>}>
                <Leave/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'travel-approval',
        element: (<RouterBefore meta={{
            title: 'Approval Travel Reimbursement',
            titleCN: '差旅报销',
            auth: 'Leader'
        }}>
            <React.Suspense fallback={<div/>}>
                <Travel/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'procurement-approval',
        element: (<RouterBefore meta={{
            title: 'Approval Procurement',
            titleCN: '采购',
            auth: 'Leader'
        }}>
            <React.Suspense fallback={<div/>}>
                <Procurment/>
            </React.Suspense>
        </RouterBefore>)
    }, {
        path: 'workReport-approval',
        element: (<RouterBefore meta={{
            title: 'Approval Work WorkReport',
            titleCN: '工作汇报',
            auth: 'Leader'
        }}>
            <React.Suspense fallback={<div/>}>
                <WorkReport/>
            </React.Suspense>
        </RouterBefore>)
    }
]

export default webApproval;
