import {Tag} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SyncOutlined} from "@ant-design/icons";
import React from "react";
import intl from "react-intl-universal";

export const RenderStatusTag = (item: any) => {

    switch (item.status) {
        case 0:
            return (
                <Tag icon={<SyncOutlined spin/>} color={"processing"}>
                    {intl.get('waitApproval')}
                </Tag>
            )
        case 1:
            return (
                <Tag icon={<CheckCircleOutlined/>} color={"success"}>
                    {intl.get('passApprove')}
                </Tag>
            )
        case 2:
            return (
                <Tag icon={<CloseCircleOutlined/>} color={"error"}>
                    {intl.get('rejectApprove')}
                </Tag>
            )
        default:
            return (
                <Tag icon={<ExclamationCircleOutlined/>} color={"warning"}>
                    {intl.get('errorApprove')}
                </Tag>
            )
    }
}
