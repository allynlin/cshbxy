import {Tag} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import React from "react";

export const RenderUserStatusTag = (status: string) => {
    switch (status) {
        case '正常':
            return (
                <Tag icon={<CheckCircleOutlined/>} color={"success"}>正常</Tag>
            )
        case '禁用':
            return (
                <Tag icon={<CloseCircleOutlined/>} color={"error"}>禁用</Tag>
            )
        default:
            return (
                <Tag icon={<ExclamationCircleOutlined/>} color={"processing"}>未知用户类型</Tag>
            )
    }
}
