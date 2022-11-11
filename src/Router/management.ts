const management = [
    {
        path: 'management',
        children: [
            {
                path: 'user',
                component: () => import('../pages/Management/User/UserManagement'),
                meta: {
                    title: 'User management',
                    titleCN: '用户管理',
                    Auth: 'Leader'
                }
            }, {
                path: 'departmentUser',
                component: () => import('../pages/Management/User/DepartmentUser'),
                meta: {
                    title: 'Department user',
                    titleCN: '部门用户',
                    Auth: 'Department'
                }
            }, {
                path: 'process',
                component: () => import('../pages/Management/Process'),
                meta: {
                    title: 'Process management',
                    titleCN: '流程管理',
                    Auth: 'Leader'
                }
            }
        ]
    }
]

export default management;
