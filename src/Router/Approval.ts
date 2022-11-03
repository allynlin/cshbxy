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
                    Auth: 'department',
                    Auth2: 'leader'
                }
            }, {
                path: 'leave',
                component: () => import('../pages/Approval/Leave'),
                meta: {
                    title: 'Approval Leave',
                    titleCN: '请假',
                    Auth: 'department',
                    Auth2: 'leader'
                }
            }, {
                path: 'travelReimbursement',
                component: () => import('../pages/Approval/TravelReimbursement'),
                meta: {
                    title: 'Approval Travel Reimbursement',
                    titleCN: '差旅报销',
                    Auth: 'department',
                    Auth2: 'leader'
                }
            }, {
                path: 'procurement',
                component: () => import('../pages/Approval/Procurement'),
                meta: {
                    title: 'Approval Procurement',
                    titleCN: '采购',
                    Auth: 'department',
                    Auth2: 'leader'
                }
            }, {
                path: 'workReport',
                component: () => import('../pages/Approval/WorkReport'),
                meta: {
                    title: 'Approval Work WorkReport',
                    titleCN: '工作汇报',
                    Auth: 'department',
                    Auth2: 'leader'
                }
            }
        ]
    }
]

export default teacherRecord;
