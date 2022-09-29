import {MethodType} from "./promise";

const promise = require('./promise');

// 登录
export const teacherLogin = async (username: String, password: String) => {
    return await promise.Request('/login/teacher', MethodType.POST, {
        username,
        password
    })
};

export const departmentLogin = async (username: String, password: String) => {
    return await promise.Request('/login/department', MethodType.POST, {
        username,
        password
    })
}

export const leaderLogin = async (username: String, password: String) => {
    return await promise.Request('/login/leader', MethodType.POST, {
        username,
        password
    })
}

// 注册接口
export const teacherRegister = async (username: String, password: String, realeName: String, gender: String, tel: String, email: String, departmentUid: String) => {
    return await promise.Request('/register/teacher', MethodType.POST, {
        username,
        password,
        realeName,
        gender,
        tel,
        email,
        departmentUid
    })
};

export const departmentRegister = async (username: String, password: String, realeName: String, gender: String, tel: String, email: String, leaderUid: String) => {
    return await promise.Request('/register/department', MethodType.POST, {
        username,
        password,
        realeName,
        gender,
        tel,
        email,
        leaderUid
    })
};

export const leaderRegister = async (username: String, password: String, realeName: String, gender: String, tel: String, email: String) => {
    return await promise.Request('/register/leader', MethodType.POST, {
        username,
        password,
        realeName,
        gender,
        tel,
        email
    })
};

// 校验 token 是否有效
export const checkTeacherToken = async () => {
    return await promise.Request('/login/checkTeacher', MethodType.POST)
}

export const checkDepartmentToken = async () => {
    return await promise.Request('/login/checkDepartment', MethodType.POST)
}

export const checkLeaderToken = async () => {
    return await promise.Request('/login/checkLeader', MethodType.POST)
}

// 校验用户名是否存在
export const queryTeacherUsername = async (username: String) => {
    return await promise.Request('/query/teacher', MethodType.POST, {
        username
    })
}

export const queryDepartmentUsername = async (username: String) => {
    return await promise.Request('/query/department', MethodType.POST, {
        username
    })
}

export const queryLeaderUsername = async (username: String) => {
    return await promise.Request('/query/leader', MethodType.POST, {
        username
    })
}

// 获取列表信息
export const queryDepartmentMessage = async () => {
    return await promise.Request('/query/departmentMessage', MethodType.GET)
}

export const queryLeaderMessage = async () => {
    return await promise.Request('/query/leaderMessage', MethodType.GET)
}

// 删除文件
export const deleteFile = async (fileName: String) => {
    return await promise.Request('/api/deleteUploadFile', MethodType.POST, {
        fileName
    })
}

// 教师变更部门申请
export const teacherChangeDepartment = async (departmentUid: String, changeReason: String) => {
    return await promise.Request('/apply/teacherChangeDepartment', MethodType.POST, {
        departmentUid,
        changeReason
    }, {headers: {tableUid: 'changedepartmentbyteacher'}})
}

// 查询正在审批的部门变更申请
export const checkTeacherChangeDepartment = async () => {
    return await promise.Request('/apply/checkTeacherChangeDepartment', MethodType.POST)
}

// 查询上次上传的文件
export const checkLastTimeUploadFiles = async (tableUid: String) => {
    return await promise.Request('/api/checkLastTimeUploadFiles', MethodType.POST, {}, {headers: {tableUid: tableUid}})
}