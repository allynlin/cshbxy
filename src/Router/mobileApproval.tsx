import Approval from '../pages/Approval/Mobile/Approval'

const approval = [{
    path: 'approval',
    redirect: '/m/approval/departmentChange',
}, {
    path: 'approval',
    element: <Approval/>,
    children: [
        {
            path: 'departmentChange',
            component: () => import('../pages/Approval/Mobile/DepartmentChange'),
            meta: {
                title: '部门变更',
                Auth: 'Leader',
            }
        }, {
            path: 'leave',
            component: () => import('../pages/Approval/Mobile/Leave'),
            meta: {
                title: '请假',
                Auth: 'Leader',
            }
        }, {
            path: 'travel',
            component: () => import('../pages/Approval/Mobile/Travel'),
            meta: {
                title: '差旅报销',
                Auth: 'Leader',
            }
        }, {
            path: 'procurement',
            component: () => import('../pages/Approval/Mobile/Procurement'),
            meta: {
                title: '采购',
                Auth: 'Leader',
            }
        }, {
            path: 'workReport',
            component: () => import('../pages/Approval/Mobile/WorkReport'),
            meta: {
                title: '工作汇报',
                Auth: 'Leader',
            }
        }
    ]
}]

export default approval;
