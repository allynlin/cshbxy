/**
 *  渲染状态标签
 *  @param {string} status 状态。0：待审核，1：审核通过，2：审核不通过
 *  @return {JSX.Element} 状态标签
 *  点击标签弹出全局 message，显示状态对应的文字
 *  update 2022-10-07
 */
import {Tag, message} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SyncOutlined} from "@ant-design/icons";
import React from "react";

import {red, yellow, green, blue} from "../../baseInfo";

export const RenderStatusTag = (status: number) => {
    switch (status) {
        case 0:
            return (
                <Tag icon={<SyncOutlined spin/>} color={yellow} onClick={() => message.warning('您的申请正在审批中')}>
                    审批中
                </Tag>
            )
        case 1:
            return (
                <Tag icon={<CheckCircleOutlined/>} color={green} onClick={() => message.success('您的申请已审批通过')}>
                    审批通过
                </Tag>
            )
        case 2:
            return (
                <Tag icon={<CloseCircleOutlined/>} color={red} onClick={() => message.error('您的申请被驳回')}>
                    审批驳回
                </Tag>
            )
        default:
            return (
                <Tag icon={<ExclamationCircleOutlined/>} color={blue} onClick={() => message.info('您的申请状态异常')}>
                    状态异常
                </Tag>
            )
    }
}