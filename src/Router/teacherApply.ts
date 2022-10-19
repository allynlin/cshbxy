const teacherApply = [
    {
        path: 'apply',
        children: [
            {
                path: 'departmentChange',
                component: () => import('../pages/Apply/DepartmentChange/Teacher'),
                meta: {
                    title: 'Department Change',
                    titleCN: '部门变更',
                    Auth: 'teacher'
                }
            },
            {
                path: 'TravelReimbursement',
                component: () => import('../pages/Apply/TravelReimbursement'),
                meta: {
                    title: 'Travel Reimbursement',
                    titleCN: '差旅报销',
                    Auth: 'teacher'
                }
            }, {
                path: 'procurement',
                component: () => import('../pages/Apply/Procurement'),
                meta: {
                    title: 'Procurement',
                    titleCN: '采购',
                    Auth: 'teacher'
                }
            }, {
                path: 'leave',
                component: () => import('../pages/Apply/LeaveApply/Teacher'),
                meta: {
                    title: 'Leave',
                    titleCN: '请假',
                    Auth: 'teacher'
                }
            }, {
                path: 'report',
                component: () => import('../pages/Apply/Report/Teacher'),
                meta: {
                    title: 'Report',
                    titleCN: '工作报告',
                    Auth: 'teacher'
                }
            }
        ]
    }
]

export default teacherApply;
