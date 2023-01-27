import {MethodType} from "./promise";

const promise = require('./promise');

/**
 * 登录
 * @param {string} username 用户名
 * @param {string} password 密码
 * @param {string} userType 用户类型
 * @returns {Promise<any>} 返回一个 Promise
 * @example userLogin('admin', '123456', 'admin') // 登录,用户名为 admin,密码为 123456,用户类型为 admin
 * @version 1.0.0
 * @version 1.1.0 新增了用户类型参数
 */
export const userLogin = async (username: string, password: string, userType: string) => {
    return promise.Request('/api/user/login', MethodType.POST, {
        username,
        password,
        userType
    });
}

/**
 * 注册
 * @param {string} username 用户名
 * @param {string} password 密码
 * @param {string} realeName 真实姓名
 * @param {string} gender 性别
 * @param {string} tel 电话
 * @param {string} email 邮箱
 * @param {string} departmentUid 部门 Uid
 * @param {string} userType 用户类型
 * @returns {Promise<any>} 返回一个 Promise
 * @example userRegister('admin', '123', '张三', '男', '123456789', '123@gmail.com', '123456','Employee') // 注册,用户名为 admin,密码为 123,真实姓名为 张三,性别为 男,电话为 123456789,邮箱为 123@gmail.com,部门 Uid 为 123456,用户类型为 Employee
 * @version 1.0.0
 */
export const userRegister = async (username: String, password: String, realeName: String, gender: String, tel: String, email: String, departmentUid: String, userType: string) => {
    return promise.Request('/api/user/add', MethodType.POST, {
        username,
        password,
        realeName,
        gender,
        tel,
        email,
        departmentUid,
        userType
    });
}

/**
 * 校验当前用户状态，自动登录
 * @returns {Promise<any>} 返回一个 Promise
 * @example checkUser() // 校验当前用户状态
 * @version 1.0.0
 * @description 如果在 Cookie 中存在 Token，则会触发自动登录进行用户状态校验
 */
export const checkUser = async () => {
    return promise.Request('/api/user/checkUser', MethodType.POST);
}

/**
 * 获取用户登录记录
 * @param {string} userUid 用户 Uid
 * @returns {Promise<any>} 返回一个 Promise
 * @example findLoginRecord('123456') // 获取用户登录记录,用户 Uid 为 123456
 * @version 1.0.0
 * @description 该接口需要用户登录后才能调用，且获取用户登录记录涉及到后端查询数据库，所以会有一定的延迟
 */
export const findLoginRecord = async (userUid: string) => {
    return promise.Request('/api/user/findLoginRecord', MethodType.POST, {
        userUid
    });
}

/**
 * 获取部门列表
 * @returns {Promise<any>} 返回一个 Promise
 * @example findUserSuperior() // 获取所有部门
 * @version 1.0.0
 */
export const findUserType = async () => {
    return promise.Request('/api/user/findUserType', MethodType.GET);
}

/**
 * 校验用户名是否可用
 * @param {string} username 用户名
 * @param {string} userType 用户类型
 * @returns {Promise<any>} 返回一个 Promise
 * @example checkUsername('admin', 'admin') // 校验用户名是否可用,用户名为 admin,用户类型为 admin
 * @version 1.0.0
 */
export const checkUsername = async (username: string, userType: string) => {
    return promise.Request('/api/user/checkUsername', MethodType.POST, {
        username,
        userType
    });
}

/**
 * 查询上次上传的文件
 * @param {string} tableUid 表格 Uid
 * @returns {Promise<any>} 返回一个 Promise
 * @example checkLastTimeUploadFiles('123456') // 查询上次上传的文件,表格 Uid 为 123456
 * @version 1.0.0
 */
export const checkLastTimeUploadFiles = async (tableUid: String) => {
    return promise.Request('/api/checkLastTimeUploadFiles', MethodType.POST, {}, {headers: {tableUid: tableUid}});
}

/**
 * 查询对应申请上传的文件
 * @param {string} RowUid 行 Uid
 * @param {string} tableUid 表格 Uid
 * @returns {Promise<any>} 返回一个 Promise
 * @example findUploadFiles('123456', 'test') // 查询对应申请上传的文件,行 Uid 为 123456,表格 Uid 为 test
 * @version 1.0.0
 */
export const findUploadFilesByUid = async (RowUid: String, tableUid: String) => {
    return promise.Request('/api/findUploadFilesByUid', MethodType.POST, {
        RowUid
    }, {headers: {tableUid: tableUid}});
}

/**
 * 删除文件
 * @param {string} fileName 文件名
 * @returns {Promise<any>} 返回一个 Promise
 * @example deleteFile('123456') // 删除文件名为 123456 的文件
 * @version 1.0.0
 */
export const deleteFile = async (fileName: String) => {
    return promise.Request('/api/deleteUploadFile', MethodType.POST, {
        fileName
    });
}

/**
 * 查询工作报告审批流程
 * @param {string} uid 申请 Uid
 * @returns {Promise<any>} 返回一个 Promise
 * @example findWorkReportByTeacherProcess('123456') // 查询工作报告审批流程,申请 Uid 为 123456
 * @version 1.0.0
 */
export const findWorkReportByTeacherProcess = async (uid: String) => {
    return promise.Request('/apply/workReport/findProcess', MethodType.POST, {
        uid
    });
}

/**
 * 提交变更部门申请
 * @param {string} departmentUid 部门 Uid
 * @param {string} changeReason 变更原因
 * @returns {Promise<any>} 返回一个 Promise
 * @example ChangeDepartment('123456','测试') // 提交变更部门申请,部门 Uid 为 123456,变更原因为 测试
 * @version 1.0.0
 */
export const ChangeDepartment = async (departmentUid: String, changeReason: String) => {
    return promise.Request('/apply/departmentChange/add', MethodType.POST, {
        departmentUid,
        changeReason
    }, {headers: {tableUid: 'ChangeDepartment'}});
}

/**
 * 查询正在审批的部门变更申请，如果有正在审批的申请，则不允许再次申请
 * @returns {Promise<any>} 返回一个 Promise
 * @example checkTeacherChangeDepartment() // 查询正在审批的部门变更申请
 * @version 1.0.0
 */
export const checkTeacherChangeDepartment = async () => {
    return promise.Request('/apply/departmentChange/checkLastTime', MethodType.POST);
}


/**
 * 查询本人部门变更申请记录
 * @returns {Promise<any>} 返回一个 Promise
 * @example checkTeacherChangeDepartmentRecord() // 查询本人部门变更申请记录
 * @version 1.0.0
 */
export const checkTeacherChangeDepartmentRecord = async () => {
    return promise.Request('/apply/departmentChange/findApplyList', MethodType.POST);
}


/**
 * 查询部门变更申请审批流程
 * @param {string} uid 申请 Uid
 * @returns {Promise<any>} 返回一个 Promise
 * @example findChangeDepartmentByTeacherProcess('123456') // 查询部门变更申请审批流程,申请 Uid 为 123456
 * @version 1.0.0
 */
export const findChangeDepartmentByTeacherProcess = async (uid: String) => {
    return promise.Request('/apply/departmentChange/findProcess', MethodType.POST, {
        uid
    });
}

/**
 * 删除部门变更申请
 * @param {string} uid 申请 Uid
 * @param {string} tableUid 表格 Uid
 * @returns {Promise<any>} 返回一个 Promise
 * @example deleteChangeDepartmentByTeacher('123456','test') // 删除部门变更申请,申请 Uid 为 123456,表格 Uid 为 test
 * @version 1.0.0
 */
export const deleteChangeDepartmentByTeacher = async (uid: String, tableUid: String) => {
    return promise.Request('/apply/departmentChange/delete', MethodType.POST, {
        uid
    }, {headers: {tableUid: tableUid}});
}

// 刷新当前部门变更申请
export const refreshDepartmentChange = async (uid: string) => {
    return promise.Request('/apply/departmentChange/refresh', MethodType.POST, {uid});
}

// 提交工作报告
export const submitWorkReport = async (tableUid: String) => {
    return promise.Request('/apply/workReport/add', MethodType.POST, {}, {headers: {tableUid: tableUid}});
}

// 查询本周是否提交过工作报告
export const checkLastWeekWorkReport = async () => {
    return promise.Request('/apply/workReport/checkLastTime', MethodType.POST);
}

// 查询工作报告列表
export const findWorkReportList = async () => {
    return promise.Request('/apply/workReport/findApplyList', MethodType.POST);
}

// 删除工作报告
export const deleteWorkReport = async (uid: String, tableUid: String) => {
    return promise.Request('/apply/workReport/delete', MethodType.POST, {
        uid
    }, {headers: {tableUid: tableUid}});
}

// 刷新当前工作报告
export const refreshWorkReport = async (uid: string) => {
    return promise.Request('/apply/workReport/refresh', MethodType.POST, {uid});
}

// 提交请假申请
export const addLeave = async (reason: String, start_time: String, end_time: String) => {
    return promise.Request('/apply/leave/add', MethodType.POST, {
        reason,
        start_time,
        end_time
    });
}

// 查询请假记录
export const findLeaveList = async () => {
    return promise.Request('/apply/leave/findApplyList', MethodType.POST);
}

// 查询请假审批流程
export const findLeaveProcess = async (uid: String) => {
    return promise.Request('/apply/leave/findProcess', MethodType.POST, {
        uid
    });
}

// 删除提交的请假申请
export const deleteLeave = async (uid: String) => {
    return promise.Request('/apply/leave/delete', MethodType.POST, {
        uid
    });
}

// 检查上一次提交的请假申请
export const checkLastTimeLeave = async () => {
    return promise.Request('/apply/leave/checkLastTime', MethodType.POST);
}

// 刷新当前请假申请
export const refreshLeave = async (uid: string) => {
    return promise.Request('/apply/leave/refresh', MethodType.POST, {uid});
}

// 提交差旅报销申请
export const addTravelReimbursement = async (destination: String, expenses: String, reason: String, tableUid: String) => {
    return promise.Request('/apply/travel/add', MethodType.POST, {
        destination,
        expenses,
        reason
    }, {headers: {tableUid: tableUid}});
}

// 查询差旅报销申请记录
export const findTravelReimbursementApplyList = async (destination?: String, expenses?: String, reason?: String) => {
    return promise.Request('/apply/travel/findApplyList', MethodType.POST, {
        destination,
        expenses,
        reason
    });
}

// 查询差旅报销审批流程
export const findTravelProcess = async (uid: String) => {
    return promise.Request('/apply/travel/findProcess', MethodType.POST, {
        uid
    });
}

// 删除差旅报销申请
export const deleteTravelReimbursementApply = async (uid: String) => {
    return promise.Request('/apply/travel/delete', MethodType.POST, {
        uid
    });
}

// 刷新差旅报销申请
export const refreshTravel = async (uid: String) => {
    return promise.Request('/apply/travel/refresh', MethodType.POST, {
        uid
    });
}

// 采购申请
export const addProcurement = async (items: string, price: string, reason: string) => {
    return promise.Request('/apply/procurement/add', MethodType.POST, {
        items,
        price,
        reason
    });
}

// 查询采购记录
export const findProcurementList = async () => {
    return promise.Request('/apply/procurement/findApplyList', MethodType.POST);
}

// 查询采购流程
export const findProcurementProcess = async (uid: String) => {
    return promise.Request('/apply/procurement/findProcess', MethodType.POST, {
        uid
    });
}

// 删除采购申请
export const deleteProcurement = async (uid: String) => {
    return promise.Request('/apply/procurement/delete', MethodType.POST, {
        uid
    });
}

// 刷新当前采购申请
export const refreshProcurement = async (uid: string) => {
    return promise.Request('/apply/procurement/refresh', MethodType.POST, {uid});
}

// 查询等待审批的部门变更申请
export const findDepartmentChangeWaitApprovalList = async () => {
    return promise.Request('/apply/departmentChange/findWaitList', MethodType.POST);
}

// 通过部门变更申请
export const resolveDepartmentChange = async (uid: String) => {
    return promise.Request('/apply/departmentChange/resolve', MethodType.POST, {
        uid
    });
}

// 驳回部门变更申请
export const rejectDepartmentChange = async (uid: String, reject_reason: string) => {
    return promise.Request('/apply/departmentChange/reject', MethodType.POST, {
        uid,
        reject_reason
    });
}

// 查询等待审批的请假申请
export const findLeaveWaitApprovalList = async () => {
    return promise.Request('/apply/leave/findWaitList', MethodType.POST);
}

// 通过请假申请
export const resolveLeave = async (uid: String) => {
    return promise.Request('/apply/leave/resolve', MethodType.POST, {
        uid
    });
}

// 驳回请假申请
export const rejectLeave = async (uid: String, reject_reason: string) => {
    return promise.Request('/apply/leave/reject', MethodType.POST, {
        uid,
        reject_reason
    });
}

// 查询等待审批的差旅报销申请
export const findTravelWaitApprovalList = async () => {
    return promise.Request('/apply/travel/findWaitList', MethodType.POST);
}

// 通过差旅报销申请
export const resolveTravel = async (uid: String) => {
    return promise.Request('/apply/travel/resolve', MethodType.POST, {
        uid
    });
}

// 驳回差旅报销申请
export const rejectTravel = async (uid: String, reject_reason: string) => {
    return promise.Request('/apply/travel/reject', MethodType.POST, {
        uid,
        reject_reason
    });
}

// 查询等待审批的采购申请
export const findProcurementWaitApprovalList = async () => {
    return promise.Request('/apply/procurement/findWaitList', MethodType.POST);
}

// 通过采购申请
export const resolveProcurement = async (uid: String) => {
    return promise.Request('/apply/procurement/resolve', MethodType.POST, {
        uid
    });
}

// 驳回采购申请
export const rejectProcurement = async (uid: String, reject_reason: string) => {
    return promise.Request('/apply/procurement/reject', MethodType.POST, {
        uid,
        reject_reason
    });
}

// 查询等待审批的工作报告
export const findWorkReportWaitApprovalList = async () => {
    return promise.Request('/apply/workReport/findWaitList', MethodType.POST);
}

// 通过工作报告
export const resolveWorkReport = async (uid: String) => {
    return promise.Request('/apply/workReport/resolve', MethodType.POST, {
        uid
    });
}

/**
 * 驳回工作报告
 * @param {string} uid 工作报告 uid
 * @param {string} reject_reason 驳回原因
 * @returns {Promise<any>} 返回一个 Promise 对象
 * @example rejectWorkReport('123456789','测试') // 驳回工作报告 uid 为 123456789 的工作报告, 驳回原因为 测试
 * @version 1.0.0
 */
export const rejectWorkReport = async (uid: String, reject_reason: string) => {
    return promise.Request('/apply/workReport/reject', MethodType.POST, {
        uid,
        reject_reason
    });
}

/**
 * 修改密码
 * @param {string} uid 用户 uid
 * @param {string} password 密码
 * @returns {Promise<any>} 返回一个 Promise 对象
 * @example updatePassword('123456789','123456') // 修改用户 uid 为 123456789 的密码为 123456
 * @version 1.0.0
 */
export const updatePassword = async (uid: string, password: string) => {
    return promise.Request('/api/user/updatePassword', MethodType.POST, {
        uid,
        password
    });
}

/**
 * 更新用户信息
 * @param {string} uid 用户 uid
 * @param {string} realeName 真实姓名
 * @param  {string} gender 性别
 * @param {string} tel 电话
 * @param {string} email 邮箱
 * @returns {Promise<any>} 返回一个 Promise 对象
 * @example update('123456789', 'admin', '男', '123456789', '123@gmail.com') // 修改用户 uid 为 123456789 的信息为真实姓名为 admin 性别为男 电话为 123456789 邮箱为 123@gmail.com
 * @version 1.0.0
 */
export const updateUserInfo = async (uid: string, realeName: string, gender: string, tel: string, email: string) => {
    return promise.Request('/api/user/update', MethodType.POST, {
        uid,
        realeName,
        gender,
        tel,
        email
    });
}

/**
 * 修改用户名
 * @param {string} uid 用户 uid
 * @param {string} username 用户名
 * @returns {Promise<any>} 返回一个 Promise 对象
 * @example update('123456789', 'admin') // 修改用户 uid 为 123456789 的用户名为 admin
 * @version 1.0.0
 */
export const updateUserName = async (uid: string, username: string) => {
    return promise.Request('/api/user/updateUsername', MethodType.POST, {
        uid,
        username
    });
}

/**
 * 查询所有用户
 * @returns {Promise<any>} 返回一个 Promise 对象
 * @example findAllUser()
 * @version 1.0.0
 */
export const findAllUser = async () => {
    return promise.Request('/api/user/findAllUser', MethodType.POST);
}

/**
 * 根据部门查询用户
 * @param {string} departmentUid 部门 uid
 * @returns {Promise<any>} 返回一个 Promise 对象
 * @example findUserByDepartment('123456789') // 查询部门 uid 为 123456789 的用户
 * @version 1.0.0
 */
export const findUserByDepartment = async (departmentUid: string) => {
    return promise.Request('/api/user/findAllUserByDepartmentUid', MethodType.POST, {departmentUid});
}

/**
 * 修改用户状态
 * @param {string} uid 用户 uid
 * @param {number} status 用户状态
 * @returns {Promise<any>} 返回一个 Promise 对象
 * @example updateUserStatus('123456789',1) // 将用户 uid 为 123456789 的用户状态修改为 1
 * @version 1.0.0
 */
export const updateUserStatus = async (uid: string, status: number) => {
    return promise.Request('/api/user/updateStatus', MethodType.POST, {
        uid,
        status
    });
}

/**
 * 删除用户
 * @param {string} uid 用户 uid
 * @returns {Promise<any>} 返回一个 Promise 对象
 * @example deleteUser('123456789') // 删除用户 uid 为 123456789 的用户
 * @version 1.0.0
 * @description 该方法会删除用户的所有基本信息且无法恢复，但不会影响已经提交的申请
 */
export const deleteUser = async (uid: string) => {
    return promise.Request('/api/user/delete', MethodType.POST, {
        uid
    });
}

/**
 * 获取所有可以审批的用户
 * @returns {Promise<any>} 返回一个 Promise 对象
 * @example findProcessUser() // 获取所有可以审批的用户
 * @version 1.0.0
 */
export const findProcessUser = async () => {
    return promise.Request('/api/user/findProcessUser', MethodType.POST);
}

/**
 * 查询所有审批流程
 * @returns {Promise<any>} 返回一个 Promise 对象
 * @example findAllProcess() // 查询所有审批流程
 * @version 1.0.0
 */
export const findAllProcess = async () => {
    return promise.Request('/process/findAllProcess', MethodType.POST);
}

/**
 * 修改审批流程
 * @param {string} uid 审批 uid
 * @param {string} process 审批流程
 * @returns {Promise<any>} 返回一个 Promise 对象
 * @example updateProcess('1234', '5678') // 修改审批 1234 的流程为 5678
 * @version 1.0.0
 */
export const updateProcess = async (uid: string, process: string) => {
    return promise.Request('/process/updateProcess', MethodType.POST, {
        uid,
        process
    });
}

/**
 * 修改部门直属领导
 * @param {string} departmentUid 部门 uid
 * @param {string} uid 领导 uid
 * @returns {Promise<any>} 返回一个 Promise 对象
 * @example updateDepartmentLeader('1234', '5678') // 修改部门 1234 的直属领导为 5678
 * @version 1.0.0
 */
export const updateDepartmentLeader = async (departmentUid: string, uid: string) => {
    return promise.Request('/api/user/updateDepartmentLeader', MethodType.POST, {
        departmentUid,
        uid
    });
}

/**
 * 获取用户设置
 * @param {string} uid 用户 uid
 * @returns {Promise<any>} 返回一个 Promise 对象
 * @example findUserSetting('123456789') // 获取用户 uid 为 123456789 的设置
 * @version 1.0.0
 */
export const findUserSetting = async (uid: string) => {
    return promise.Request('/api/user/findUserSetting', MethodType.POST, {uid})
}

/**
 * 修改用户设置
 * @param {string} uid 用户 uid
 * @param {string} setting 用户设置
 * @returns {Promise<any>} 返回一个 Promise 对象
 * @example updateUserSetting('123456789', '123456789') // 修改用户 uid 为 123456789 的设置为 123456789
 * @version 1.0.0
 */
export const updateUserSetting = async (uid: string, setting: string) => {
    return promise.Request('/api/user/updateUserSetting', MethodType.POST, {uid, setting})
}