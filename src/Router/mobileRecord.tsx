import Record from "../pages/Record/Mobile/Record";
import React, {lazy} from "react";
import {RouterBefore} from "./route";
import MobileSkeleton from "../component/Skeleton/MobileSkeleton";
import {Navigate} from "react-router-dom";

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
            path: "/m/record",
            element: <Navigate to="/m/record/departmentChange"/>
        }, {
            path: 'departmentChange',
            element: (<RouterBefore meta={{
                title: '变更部门记录',
                auth: 'Employee'
            }}>
                <React.Suspense fallback={<MobileSkeleton/>}>
                    <MobileDepartmentChange/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'travel',
            element: (<RouterBefore meta={{
                title: '差旅报销记录',
                auth: 'Employee'
            }}>
                <React.Suspense fallback={<MobileSkeleton/>}>
                    <MobileTravel/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'leave',
            element: (<RouterBefore meta={{
                title: '请假申请记录',
                auth: 'Employee'
            }}>
                <React.Suspense fallback={<MobileSkeleton/>}>
                    <MobileLeave/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'procurement',
            element: (<RouterBefore meta={{
                title: '采购申请记录',
                auth: 'Employee'
            }}>
                <React.Suspense fallback={<MobileSkeleton/>}>
                    <MobileProcurement/>
                </React.Suspense>
            </RouterBefore>)
        }, {
            path: 'workReport',
            element: (<RouterBefore meta={{
                title: '工作报告记录',
                auth: 'Employee'
            }}>
                <React.Suspense fallback={<MobileSkeleton/>}>
                    <MobileWorkReport/>
                </React.Suspense>
            </RouterBefore>)
        }]
    }
]

export default mobileRecord;
