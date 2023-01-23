import Approval from '../pages/Approval/Mobile/Approval'
import React, {lazy} from "react";
import {RouterBefore} from "./route";
import MobileSkeleton from "../component/Skeleton/MobileSkeleton";
import {Navigate} from "react-router-dom";

const DepartmentChange = lazy(() => import('../pages/Approval/Mobile/DepartmentChange'));
const Travel = lazy(() => import('../pages/Approval/Mobile/Travel'));
const Procurment = lazy(() => import('../pages/Approval/Mobile/Procurement'));
const Leave = lazy(() => import('../pages/Approval/Mobile/Leave'));
const WorkReport = lazy(() => import('../pages/Approval/Mobile/WorkReport'));

const mobileApproval = [
    {
        path: 'approval',
        element: <Approval/>,
        children: [{
            path: "/m/approval",
            element: <Navigate to="/m/approval/departmentChange"/>
        }, {
            path: 'departmentChange',
            element: (<RouterBefore meta={{
                title: '部门变更',
                auth: 'Leader'
            }}>
                <React.Suspense fallback={<MobileSkeleton/>}>
                    <DepartmentChange/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'travel',
            element: (<RouterBefore meta={{
                title: '差旅报销',
                auth: 'Leader'
            }}>
                <React.Suspense fallback={<MobileSkeleton/>}>
                    <Travel/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'procurement',
            element: (<RouterBefore meta={{
                title: '采购',
                auth: 'Leader'
            }}>
                <React.Suspense fallback={<MobileSkeleton/>}>
                    <Procurment/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'leave',
            element: (<RouterBefore meta={{
                title: '请假',
                auth: 'Leader'
            }}>
                <React.Suspense fallback={<MobileSkeleton/>}>
                    <Leave/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'workReport',
            element: (<RouterBefore meta={{
                title: '工作报告',
                auth: 'Leader'
            }}>
                <React.Suspense fallback={<MobileSkeleton/>}>
                    <WorkReport/>
                </React.Suspense>
            </RouterBefore>)
        }]
    }
]

export default mobileApproval;
