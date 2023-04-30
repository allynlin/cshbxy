import {Tag} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SyncOutlined} from "@ant-design/icons";
import React from "react";

export const RenderStatusTag = (item: any) => {

    switch (item.status) {
        case 0:
            return (
                <Tag icon={<SyncOutlined spin/>} color={"processing"}>等待审批</Tag>
            )
        case 1:
            return (
                <Tag icon={<CheckCircleOutlined/>} color={"success"}>通过审批</Tag>
            )
        case 2:
            return (
                <Tag icon={<CloseCircleOutlined/>} color={"error"}>驳回审批</Tag>
            )
        default:
            return (
                <Tag icon={<ExclamationCircleOutlined/>} color={"warning"}>审批出错</Tag>
            )
    }
}
