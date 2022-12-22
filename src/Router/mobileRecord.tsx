import Record from "../pages/Record/Mobile/Record";

const record = [{
    path: 'record',
    redirect: '/m/record/departmentChange'
}, {
    path: 'record',
    element: <Record/>,
    children: [
        {
            path: 'departmentChange',
            component: () => import('../pages/Record/Mobile/DepartmentChange'),
            meta: {
                title: '变更部门记录',
                Auth: 'Employee'
            }
        }, {
            path: 'travel',
            component: () => import('../pages/Record/Mobile/Travel'),
            meta: {
                title: '差旅报销记录',
                Auth: 'Employee'
            }
        }, {
            path: 'leave',
            component: () => import('../pages/Record/Mobile/Leave'),
            meta: {
                title: '请假记录',
                Auth: 'Employee'
            }
        }, {
            path: 'procurement',
            component: () => import('../pages/Record/Mobile/Procurement'),
            meta: {
                title: '采购记录',
                Auth: 'Employee'
            }
        }, {
            path: 'workReport',
            component: () => import('../pages/Record/Mobile/WorkReport'),
            meta: {
                title: '工作报告记录',
                Auth: 'Employee'
            }
        }
    ]
}]

export default record;
