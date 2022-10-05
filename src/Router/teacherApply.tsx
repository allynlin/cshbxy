const teacherApply = [
    {
        path: 'apply',
        children: [
            {
                path: 'departmentChange',
                component: () => import('../pages/Apply/DepartmentChange/Teacher'),
                meta: {
                    title: '申请变更部门',
                    Auth: 'teacher'
                }
            },
            {
                path: 'TravelReimbursement',
                component: () => import('../pages/Apply/TravelReimbursement'),
                meta: {
                    title: '差旅报销申请',
                    Auth: 'teacher'
                }
            }, {
                path: 'procurement',
                component: () => import('../pages/Apply/Procurement'),
                meta: {
                    title: '采购申请',
                    Auth: 'teacher'
                }
            }, {
                path: 'leave',
                component: () => import('../pages/Apply/LeaveApply/Teacher'),
                meta: {
                    title: '请假申请',
                    Auth: 'teacher'
                }
            }, {
                path: 'report',
                component: () => import('../pages/Apply/Report/Teacher'),
                meta: {
                    title: '工作报告',
                    Auth: 'teacher'
                }
            }
        ]
    }
]

export default teacherApply;