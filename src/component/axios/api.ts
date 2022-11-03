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
export const teacherLogin = async (username: String, password: String) => {
    return promise.Request('/login/teacher', MethodType.POST, {
        username,
        password
    });
};

export const departmentLogin = async (username: String, password: String) => {
    return promise.Request('/login/department', MethodType.POST, {
        username,
        password
    });
}

export const leaderLogin = async (username: String, password: String) => {
    return promise.Request('/login/leader', MethodType.POST, {
        username,
        password
    });
}

// 注册接口
export const teacherRegister = async (username: String, password: String, realeName: String, gender: String, tel: String, email: String, departmentUid: String) => {
    return promise.Request('/register/teacher', MethodType.POST, {
        username,
        password,
        realeName,
        gender,
        tel,
        email,
        departmentUid
    });
};

export const departmentRegister = async (username: String, password: String, realeName: String, gender: String, tel: String, email: String, leaderUid: String) => {
    return promise.Request('/register/department', MethodType.POST, {
        username,
        password,
        realeName,
        gender,
        tel,
        email,
        leaderUid
    });
};

export const leaderRegister = async (username: String, password: String, realeName: String, gender: String, tel: String, email: String) => {
    return promise.Request('/register/leader', MethodType.POST, {
        username,
        password,
        realeName,
        gender,
        tel,
        email
    });
};

// 校验 token 是否有效
export const checkTeacherToken = async () => {
    return promise.Request('/login/checkTeacher', MethodType.POST);
}

export const checkDepartmentToken = async () => {
    return promise.Request('/login/checkDepartment', MethodType.POST);
}

export const checkLeaderToken = async () => {
    return promise.Request('/login/checkLeader', MethodType.POST);
}

// 校验用户名是否存在
export const queryTeacherUsername = async (username: String) => {
    return promise.Request('/query/teacher', MethodType.POST, {
        username
    });
}

export const queryDepartmentUsername = async (username: String) => {
    return promise.Request('/query/department', MethodType.POST, {
        username
    });
}

export const queryLeaderUsername = async (username: String) => {
    return promise.Request('/query/leader', MethodType.POST, {
        username
    });
}

// 获取列表信息
export const queryDepartmentMessage = async () => {
    return promise.Request('/query/departmentMessage', MethodType.GET);
}

export const queryLeaderMessage = async () => {
    return promise.Request('/query/leaderMessage', MethodType.GET);
}

// 转换 uid 为真实姓名
export const getRealeName = async (uid: String) => {
    return promise.Request('/query/getRealeName', MethodType.POST, {
        uid
    });
}

// 删除文件
export const deleteFile = async (fileName: String) => {
    return promise.Request('/api/deleteUploadFile', MethodType.POST, {
        fileName
    });
}

// 教师变更部门申请
export const teacherChangeDepartment = async (departmentUid: String, changeReason: String) => {
    return promise.Request('/apply/teacherChangeDepartment', MethodType.POST, {
        departmentUid,
        changeReason
    }, {headers: {tableUid: 'changedepartmentbyteacher'}});
}

// 查询正在审批的部门变更申请
export const checkTeacherChangeDepartment = async () => {
    return promise.Request('/apply/checkTeacherChangeDepartment', MethodType.POST);
}

// 查询上次上传的文件
export const checkLastTimeUploadFiles = async (tableUid: String) => {
    return promise.Request('/api/checkLastTimeUploadFiles', MethodType.POST, {}, {headers: {tableUid: tableUid}});
}

// 查询教师部门变更记录
export const checkTeacherChangeDepartmentRecord = async () => {
    return promise.Request('/apply/findTeacherChangeDepartmentList', MethodType.POST);
}

// 查询教师部门变更记录查询上传的文件
export const findUploadFilesByUid = async (RowUid: String, tableUid: String) => {
    return promise.Request('/api/findUploadFilesByUid', MethodType.POST, {
        RowUid
    }, {headers: {tableUid: tableUid}});
}

// 查询教师变更部门审批流程
export const findChangeDepartmentByTeacherProcess = async (uid: String) => {
    return promise.Request('/apply/findChangeDepartmentByTeacherProcess', MethodType.POST, {
        uid
    });
}

// 删除申请
export const deleteChangeDepartmentByTeacher = async (uid: String, tableUid: String) => {
    return promise.Request('/apply/deleteChangeDepartmentByTeacher', MethodType.POST, {
        uid
    }, {headers: {tableUid: tableUid}});
}

// 提交工作报告
export const submitWorkReport = async (tableUid: String) => {
    return promise.Request('/workReport/addWorkReport', MethodType.POST, {}, {headers: {tableUid: tableUid}});
}

// 查询本周是否提交过工作报告
export const checkLastWeekWorkReport = async () => {
    return promise.Request('/workReport/checkLastWeekWorkReport', MethodType.POST);
}

// 查询工作报告列表
export const findWorkReportList = async () => {
    return promise.Request('/workReport/findWorkReportList', MethodType.POST);
}

// 删除工作报告
export const deleteWorkReport = async (uid: String, tableUid: String) => {
    return promise.Request('/workReport/deleteWorkReportByTeacher', MethodType.POST, {
        uid
    }, {headers: {tableUid: tableUid}});
}

// 查询审批流程
export const findWorkReportByTeacherProcess = async (uid: String) => {
    return promise.Request('/workReport/findWorkReportByTeacherProcess', MethodType.POST, {
        uid
    });
}

// 提交请假申请
export const addLeave = async (reason: String, start_time: String, end_time: String) => {
    return promise.Request('/leave/addLeave', MethodType.POST, {
        reason,
        start_time,
        end_time
    });
}

// 查询请假记录
export const findLeaveList = async () => {
    return promise.Request('/leave/findLeaveList', MethodType.POST);
}

// 查询请假审批流程
export const findLeaveProcess = async (uid: String) => {
    return promise.Request('/leave/findLeaveProcess', MethodType.POST, {
        uid
    });
}

// 删除提交的请假申请
export const deleteLeave = async (uid: String) => {
    return promise.Request('/leave/deleteLeave', MethodType.POST, {
        uid
    });
}

// 检查上一次提交的请假申请
export const checkLastTimeLeave = async () => {
    return promise.Request('/leave/checkLastTimeLeave', MethodType.POST);
}

// 修改请假申请
export const updateLeave = async (uid: String, reason: String, start_time: String, end_time: String) => {
    return promise.Request('/leave/updateLeave', MethodType.POST, {
        uid,
        reason,
        start_time,
        end_time
    });
}

// 提交差旅报销申请
export const addTravelReimbursement = async (destination: String, expenses: String, reason: String, tableUid: String) => {
    return promise.Request('/apply/addTravelReimbursement', MethodType.POST, {
        destination,
        expenses,
        reason
    }, {headers: {tableUid: tableUid}});
}

// 查询差旅报销申请记录
export const findTravelReimbursementApplyList = async (destination?: String, expenses?: String, reason?: String) => {
    return promise.Request('/apply/findTravelReimbursementApplyList', MethodType.POST, {
        destination,
        expenses,
        reason
    });
}

// 查询差旅报销审批流程
export const findTravelProcess = async (uid: String) => {
    return promise.Request('/apply/findTravelProcess', MethodType.POST, {
        uid
    });
}

// 删除差旅报销申请
export const deleteTravelReimbursementApply = async (uid: String) => {
    return promise.Request('/apply/deleteTravelReimbursementApply', MethodType.POST, {
        uid
    });
}

// 修改差旅报销申请
export const updateTravelReimbursementApply = async (uid: String, destination: String, expenses: String, reason: String, tableUid: String) => {
    return promise.Request('/apply/updateTravelReimbursementApply', MethodType.POST, {
        uid,
        destination,
        expenses,
        reason
    }, {headers: {tableUid: tableUid}});
}

// 采购申请
export const addProcurement = async (items: string, price: string, reason: string) => {
    return promise.Request('/procurement/addProcurement', MethodType.POST, {
        items,
        price,
        reason
    });
}

// 查询采购记录
export const findProcurementList = async () => {
    return promise.Request('/procurement/findProcurementList', MethodType.POST);
}

// 查询采购流程
export const findProcurementProcess = async (uid: String) => {
    return promise.Request('/procurement/findProcurementProcess', MethodType.POST, {
        uid
    });
}

// 删除采购申请
export const deleteProcurement = async (uid: String) => {
    return promise.Request('/procurement/deleteProcurement', MethodType.POST, {
        uid
    });
}

// 修改采购申请
export const updateProcurement = async (uid: String, items: string, price: string, reason: string) => {
    return promise.Request('/procurement/updateProcurement', MethodType.POST, {
        uid,
        items,
        price,
        reason
    });
}

// 查询等待审批的部门变更申请
export const findDepartmentChangeWaitApprovalList = async () => {
    return promise.Request('/apply/findWaitList', MethodType.POST);
}

// 通过部门变更申请
export const resolveDepartmentChange = async (uid: String) => {
    return promise.Request('/apply/resolveApply', MethodType.POST, {
        uid
    });
}

// 驳回部门变更申请
export const rejectDepartmentChange = async (uid: String, reject_reason: string) => {
    return promise.Request('/apply/rejectApply', MethodType.POST, {
        uid,
        reject_reason
    });
}

// 查询等待审批的请假申请
export const findLeaveWaitApprovalList = async () => {
    return promise.Request('/leave/findLeaveListByNextUid', MethodType.POST);
}

// 通过请假申请
export const resolveLeave = async (uid: String) => {
    return promise.Request('/leave/resolveLeave', MethodType.POST, {
        uid
    });
}

// 驳回请假申请
export const rejectLeave = async (uid: String, reject_reason: string) => {
    return promise.Request('/leave/rejectLeave', MethodType.POST, {
        uid,
        reject_reason
    });
}

// 查询等待审批的差旅报销申请
export const findTravelWaitApprovalList = async () => {
    return promise.Request('/apply/findTravelReimbursementListByNextUid', MethodType.POST);
}

// 通过差旅报销申请
export const resolveTravel = async (uid: String) => {
    return promise.Request('/apply/resolveTravelReimbursement', MethodType.POST, {
        uid
    });
}

// 驳回差旅报销申请
export const rejectTravel = async (uid: String, reject_reason: string) => {
    return promise.Request('/apply/rejectTravelReimbursement', MethodType.POST, {
        uid,
        reject_reason
    });
}

// 查询等待审批的采购申请
export const findProcurementWaitApprovalList = async () => {
    return promise.Request('/procurement/findProcurementByNextUid', MethodType.POST);
}

// 通过采购申请
export const resolveProcurement = async (uid: String) => {
    return promise.Request('/procurement/resolveProcurement', MethodType.POST, {
        uid
    });
}

// 驳回采购申请
export const rejectProcurement = async (uid: String, reject_reason: string) => {
    return promise.Request('/procurement/rejectProcurement', MethodType.POST, {
        uid,
        reject_reason
    });
}

// 查询等待审批的工作报告
export const findWorkReportWaitApprovalList = async () => {
    return promise.Request('/workReport/findWorkReportByNextUid', MethodType.POST);
}

// 通过工作报告
export const resolveWorkReport = async (uid: String) => {
    return promise.Request('/workReport/resolveWorkReport', MethodType.POST, {
        uid
    });
}

// 驳回工作报告
export const rejectWorkReport = async (uid: String, reject_reason: string) => {
    return promise.Request('/workReport/rejectWorkReport', MethodType.POST, {
        uid,
        reject_reason
    });
}
