const teacherRecord = [
    {
        path: 'record',
        children: [
            {
                path: 'departmentChange',
                component: () => import('../pages/Record/DepartmentChange'),
                meta: {
                    title: 'Department Change Record',
                    titleCN: '变更部门记录',
                    Auth: 'teacher'
                }
            }, {
                path: 'travelReimbursement',
                component: () => import('../pages/Record/TravelReimbursement'),
                meta: {
                    title: 'Travel Reimbursement Record',
                    titleCN: '差旅报销记录',
                    Auth: 'teacher'
                }
            }, {
                path: 'leave',
                component: () => import('../pages/Record/Leave'),
                meta: {
                    title: 'Leave Record',
                    titleCN: '请假记录',
                    Auth: 'teacher'
                }
            }, {
                path: 'report',
                component: () => import('../pages/Record/Report'),
                meta: {
                    title: 'Report Record',
                    titleCN: '工作报告记录',
                    Auth: 'teacher'
                }
            }
        ]
    }
]

export default teacherRecord;
