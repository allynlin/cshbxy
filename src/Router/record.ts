const record = [
    {
        path: 'record',
        children: [
            {
                path: 'departmentChange',
                component: () => import('../pages/Record/DepartmentChange'),
                meta: {
                    title: 'Department Change Record',
                    titleCN: '变更部门记录',
                    Auth: 'Employee'
                }
            }, {
                path: 'travel',
                component: () => import('../pages/Record/Travel'),
                meta: {
                    title: 'Travel Reimbursement Record',
                    titleCN: '差旅报销记录',
                    Auth: 'Employee'
                }
            }, {
                path: 'leave',
                component: () => import('../pages/Record/Leave'),
                meta: {
                    title: 'Leave Record',
                    titleCN: '请假记录',
                    Auth: 'Employee'
                }
            }, {
                path: 'workReport',
                component: () => import('../pages/Record/Report'),
                meta: {
                    title: 'WorkReport Record',
                    titleCN: '工作报告记录',
                    Auth: 'Employee'
                }
            }, {
                path: 'procurement',
                component: () => import('../pages/Record/Procurement'),
                meta: {
                    title: 'Procurement',
                    titleCN: '采购记录',
                    Auth: 'Employee'
                }
            }
        ]
    }
]

export default record;
