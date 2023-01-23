import Record from "../pages/Record/Mobile/Record";
import React, {lazy} from "react";
import {RouterBefore} from "./route";

const MobileDepartmentChange = lazy(() => import('../pages/Record/Mobile/DepartmentChange'));
const MobileTravel = lazy(() => import('../pages/Record/Mobile/Travel'));
const MobileLeave = lazy(() => import('../pages/Record/Mobile/Leave'));
const MobileProcurement = lazy(() => import('../pages/Record/Mobile/Procurement'));
const MobileWorkReport = lazy(() => import('../pages/Record/Mobile/WorkReport'));

const mobileRecord = [
    {
        path: 'record',
        element: <Record/>,
        children: [{
            path: 'departmentChange',
            element: (<RouterBefore meta={{
                title: '变更部门记录',
                auth: 'Employee'
            }}>
                <React.Suspense fallback={<div/>}>
                    <MobileDepartmentChange/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'travel',
            element: (<RouterBefore meta={{
                title: '差旅报销记录',
                auth: 'Employee'
            }}>
                <React.Suspense fallback={<div/>}>
                    <MobileTravel/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'leave',
            element: (<RouterBefore meta={{
                title: '请假申请记录',
                auth: 'Employee'
            }}>
                <React.Suspense fallback={<div/>}>
                    <MobileLeave/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'procurement',
            element: (<RouterBefore meta={{
                title: '采购申请记录',
                auth: 'Employee'
            }}>
                <React.Suspense fallback={<div/>}>
                    <MobileProcurement/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'workReport',
            element: (<RouterBefore meta={{
                title: '工作报告记录',
                auth: 'Employee'
            }}>
                <React.Suspense fallback={<div/>}>
                    <MobileWorkReport/>
                </React.Suspense>
            </RouterBefore>)
        }]
    }
]

export default mobileRecord;
