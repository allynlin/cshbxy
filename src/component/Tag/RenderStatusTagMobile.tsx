import React from "react";
import {Tag} from 'antd-mobile'

export const RenderStatusTag = (status: number) => {
    switch (status) {
        case 0:
            return (
                <Tag color={'rgba(255,141,0,1)'}>审批中</Tag>
            )
        case 1:
            return (
                <Tag color={'rgba(0,108,1,1)'}>审批通过</Tag>
            )
        case 2:
            return (
                <Tag color={'rgba(243,36,1,1)'}>审批驳回</Tag>
            )
        default:
            return (
                <Tag color={'rgba(64,169,255,1)'}>状态异常</Tag>
            )
    }
}
