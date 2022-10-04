const teacherRecord = [
    {
        path: 'record',
        children: [
            {
                path: 'departmentChange',
                component: () => import('../pages/Record/DepartmentChange'),
                meta: {
                    title: '申请变更部门记录',
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
            }
        ]
    }
]

export default teacherRecord;