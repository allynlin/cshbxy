import {MethodType} from "./promise";

const promise = require('./promise');

// 获取服务器版本
export const getVersion = async () => {
    return promise.Request('/api/getVersion', MethodType.GET);
}

// 获取服务器最低支持版本
export const getLowVersion = async () => {
    return promise.Request('/api/getLowVersion', MethodType.GET);
}

// 登录
export const userLogin = async (username: string, password: string, userType: string) => {
    return promise.Request('/api/user/login', MethodType.POST, {
        username,
        password,
        userType
    });
}

// 校验用户
export const checkUser = async () => {
    return promise.Request('/api/user/checkUser', MethodType.POST);
}

// 获取用户上级列表
export const findUserType = async () => {
    return promise.Request('/api/user/findUserType', MethodType.GET);
}

// 校验用户名是否可用
export const checkUsername = async (username: string, userType: string) => {
    return promise.Request('/api/user/checkUsername', MethodType.POST, {
        username,
        userType
    });
}

// 注册
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

// 删除文件
export const deleteFile = async (fileName: String) => {
    return promise.Request('/api/deleteUploadFile', MethodType.POST, {
        fileName
    });
}

// 变更部门申请
export const ChangeDepartment = async (departmentUid: String, changeReason: String) => {
    return promise.Request('/apply/departmentChange/add', MethodType.POST, {
        departmentUid,
        changeReason
    }, {headers: {tableUid: 'ChangeDepartment'}});
}

// 查询正在审批的部门变更申请
export const checkTeacherChangeDepartment = async () => {
    return promise.Request('/apply/departmentChange/checkLastTime', MethodType.POST);
}

// 查询上次上传的文件
export const checkLastTimeUploadFiles = async (tableUid: String) => {
    return promise.Request('/api/checkLastTimeUploadFiles', MethodType.POST, {}, {headers: {tableUid: tableUid}});
}

// 查询部门变更记录
export const checkTeacherChangeDepartmentRecord = async () => {
    return promise.Request('/apply/departmentChange/findApplyList', MethodType.POST);
}

// 查询对应申请上传的文件
export const findUploadFilesByUid = async (RowUid: String, tableUid: String) => {
    return promise.Request('/api/findUploadFilesByUid', MethodType.POST, {
        RowUid
    }, {headers: {tableUid: tableUid}});
}

// 查询变更部门审批流程
export const findChangeDepartmentByTeacherProcess = async (uid: String) => {
    return promise.Request('/apply/departmentChange/findProcess', MethodType.POST, {
        uid
    });
}

// 删除申请
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

// 查询审批流程
export const findWorkReportByTeacherProcess = async (uid: String) => {
    return promise.Request('/apply/workReport/findProcess', MethodType.POST, {
        uid
    });
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

// 修改请假申请
export const updateLeave = async (uid: String, reason: String, start_time: String, end_time: String) => {
    return promise.Request('/apply/leave/update', MethodType.POST, {
        uid,
        reason,
        start_time,
        end_time
    });
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

// 修改采购申请
export const updateProcurement = async (uid: String, items: string, price: string, reason: string) => {
    return promise.Request('/apply/procurement/update', MethodType.POST, {
        uid,
        items,
        price,
        reason
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

// 驳回工作报告
export const rejectWorkReport = async (uid: String, reject_reason: string) => {
    return promise.Request('/apply/workReport/reject', MethodType.POST, {
        uid,
        reject_reason
    });
}

// 修改密码
export const updatePassword = async (uid: string, password: string) => {
    return promise.Request('/api/user/updatePassword', MethodType.POST, {
        uid,
        password
    });
}

// 更新用户信息
export const updateUserInfo = async (uid: string, realeName: string, gender: string, tel: string, email: string) => {
    return promise.Request('/api/user/update', MethodType.POST, {
        uid,
        realeName,
        gender,
        tel,
        email
    });
}

// 更新用户名
export const updateUserName = async (uid: string, username: string) => {
    return promise.Request('/api/user/updateUsername', MethodType.POST, {
        uid,
        username
    });
}

// 查询所有用户
export const findAllUser = async () => {
    return promise.Request('/api/user/findAllUser', MethodType.POST);
}

// 更新用户状态
export const updateUserStatus = async (uid: string, status: number) => {
    return promise.Request('/api/user/updateStatus', MethodType.POST, {
        uid,
        status
    });
}
