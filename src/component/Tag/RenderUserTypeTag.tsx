import {Tag} from "antd";
import React from "react";

export const RenderUserTypeTag = (item: any) => {
    if (item.departmentKey) {
        return <Tag color='#531dab'>直属领导</Tag>
    }
    switch (item.userType) {
        case 'Department':
            return <Tag color='#ffa940'>管理员</Tag>
        case 'Leader':
            return <Tag color='#9254de'>领导</Tag>
        case 'Employee':
            return <Tag color='#7cb305'>员工</Tag>
        default:
            return <Tag color={"processing"}>未知用户类型</Tag>
    }
}
