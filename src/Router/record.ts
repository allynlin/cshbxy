const record = [{
    path: 'departmentChange-record',
    component: () => import('../pages/Record/DepartmentChange'),
    meta: {
        title: 'Department Change Record',
        titleCN: '变更部门记录',
        Auth: 'Employee'
    }
}, {
    path: 'travel-record',
    component: () => import('../pages/Record/Travel'),
    meta: {
        title: 'Travel Reimbursement Record',
        titleCN: '差旅报销记录',
        Auth: 'Employee'
    }
}, {
    path: 'leave-record',
    component: () => import('../pages/Record/Leave'),
    meta: {
        title: 'Leave Record',
        titleCN: '请假记录',
        Auth: 'Employee'
    }
}, {
    path: 'workReport-record',
    component: () => import('../pages/Record/WorkReport'),
    meta: {
        title: 'WorkReport Record',
        titleCN: '工作报告记录',
        Auth: 'Employee'
    }
}, {
    path: 'procurement-record',
    component: () => import('../pages/Record/Procurement'),
    meta: {
        title: 'Procurement',
        titleCN: '采购记录',
        Auth: 'Employee'
    }
}]

export default record;
