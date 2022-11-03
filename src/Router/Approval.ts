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
            }
        ]
    }
]

export default teacherRecord;
