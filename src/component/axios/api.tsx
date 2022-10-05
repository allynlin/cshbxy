import {MethodType} from "./promise";

const promise = require('./promise');

// 获取服务器版本
export const getVersion = async () => {
    return promise.Request('/api/getVersion', MethodType.GET);
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