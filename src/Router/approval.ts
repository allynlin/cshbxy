const teacherRecord = [
    {
        path: 'approval',
        children: [
            {
                path: 'departmentChange',
                component: () => import('../pages/Approval/DepartmentChange'),
                meta: {
                    title: 'Approval Department Change',
                    titleCN: '部门变更',
                    Auth: 'Department',
                    Auth2: 'Leader'
                }
            }, {
                path: 'leave',
                component: () => import('../pages/Approval/Leave'),
                meta: {
                    title: 'Approval Leave',
                    titleCN: '请假',
                    Auth: 'Department',
                    Auth2: 'Leader'
                }
            }, {
                path: 'travel',
                component: () => import('../pages/Approval/Travel'),
                meta: {
                    title: 'Approval Travel Reimbursement',
                    titleCN: '差旅报销',
                    Auth: 'Department',
                    Auth2: 'Leader'
                }
            }, {
                path: 'procurement',
                component: () => import('../pages/Approval/Procurement'),
                meta: {
                    title: 'Approval Procurement',
                    titleCN: '采购',
                    Auth: 'Department',
                    Auth2: 'Leader'
                }
            }, {
                path: 'workReport',
                component: () => import('../pages/Approval/WorkReport'),
                meta: {
                    title: 'Approval Work WorkReport',
                    titleCN: '工作汇报',
                    Auth: 'Department',
                    Auth2: 'Leader'
                }
            }
        ]
    }
]

export default teacherRecord;
