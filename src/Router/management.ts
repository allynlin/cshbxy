const management = [
    {
        path: 'management',
        children: [
            {
                path: 'user',
                component: () => import('../pages/Management/UserManagement'),
                meta: {
                    title: 'User management',
                    titleCN: '用户管理',
                    Auth: 'Leader'
                }
            }, {
                path: 'departmentUser',
                component: () => import('../pages/Management/DepartmentUser'),
                meta: {
                    title: 'Department user',
                    titleCN: '部门用户',
                    Auth: 'Department'
                }
            }
        ]
    }
]

export default management;
