import Apply from "../pages/Apply";

const teacherApply = [
    {
        path: 'apply',
        children: [
            {
                path: 'departmentChange',
                component: () => import('../pages/Apply/DepartmentChange'),
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
            }
        ]
    }
]

export default teacherApply;