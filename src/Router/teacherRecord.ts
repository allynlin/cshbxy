const teacherRecord = [
    {
        path: 'record',
        children: [
            {
                path: 'departmentChange',
                component: () => import('../pages/Record/DepartmentChange'),
                meta: {
                    title: '变更部门记录',
                    Auth: 'teacher'
                }
            }, {
                path: 'TravelReimbursement',
                component: () => import('../pages/Apply/TravelReimbursement'),
                meta: {
                    title: '差旅报销申请',
                    Auth: 'teacher'
                }
            }, {
                path: 'report',
                component: () => import('../pages/Record/Report'),
                meta: {
                    title: '工作报告记录',
                    Auth: 'teacher'
                }
            }, {
                path: 'leave',
                component: () => import('../pages/Record/Leave'),
                meta: {
                    title: '请假记录',
                    Auth: 'teacher'
                }
            }
        ]
    }
]

export default teacherRecord;