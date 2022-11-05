const apply = [
    {
        path: 'apply',
        children: [
            {
                path: 'departmentChange',
                component: () => import('../pages/Apply/DepartmentChange'),
                meta: {
                    title: 'Department Change',
                    titleCN: '部门变更',
                    Auth: 'Employee'
                }
            },
            {
                path: 'travel',
                component: () => import('../pages/Apply/Travel'),
                meta: {
                    title: 'Travel Reimbursement',
                    titleCN: '差旅报销',
                    Auth: 'Employee'
                }
            }, {
                path: 'procurement',
                component: () => import('../pages/Apply/Procurement'),
                meta: {
                    title: 'Procurement',
                    titleCN: '采购',
                    Auth: 'Employee'
                }
            }, {
                path: 'leave',
                component: () => import('../pages/Apply/Leave'),
                meta: {
                    title: 'Leave',
                    titleCN: '请假',
                    Auth: 'Employee'
                }
            }, {
                path: 'workReport',
                component: () => import('../pages/Apply/WorkReport'),
                meta: {
                    title: 'WorkReport',
                    titleCN: '工作报告',
                    Auth: 'Employee'
                }
            }
        ]
    }
]

export default apply;
