import {Tag} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import React from "react";
import intl from "react-intl-universal";

export const RenderUserStatusTag = (status: string) => {
    switch (status) {
        case 'Normal':
        case '正常':
            return (
                <Tag icon={<CheckCircleOutlined/>} color={"success"}>
                    {intl.get('normal')}
                </Tag>
            )
        case 'Disabled':
        case '禁用':
            return (
                <Tag icon={<CloseCircleOutlined/>} color={"error"}>
                    {intl.get('disabled')}
                </Tag>
            )
        default:
            return (
                <Tag icon={<ExclamationCircleOutlined/>} color={"processing"}>
                    {intl.get('unKnowUserType')}
                </Tag>
            )
    }
}
