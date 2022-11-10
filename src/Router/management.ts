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
            }
        ]
    }
]

export default management;
