/**
 *  渲染状态标签
 *  @param {string} status 状态。0：待审核，1：审核通过，2：审核不通过
 *  @return {JSX.Element} 状态标签
 *  点击标签弹出全局 message，显示状态对应的文字
 *  update 2022-10-07
 */
import {message, Tag} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SyncOutlined} from "@ant-design/icons";
import React from "react";
import intl from "react-intl-universal";

export const RenderStatusTag = (status: number, msg = intl.get('apply')) => {

    switch (status) {
        case 0:
            return (
                <Tag icon={<SyncOutlined spin/>} color={"warning"}
                     onClick={() => message.warning(intl.get('underApproveMessage', {name: msg}))}>
                    {intl.get('underApprove')}
                </Tag>
            )
        case 1:
            return (
                <Tag icon={<CheckCircleOutlined/>} color={"success"}
                     onClick={() => message.success(intl.get('passApproveMessage', {name: msg}))}>
                    {intl.get('passApprove')}
                </Tag>
            )
        case 2:
            return (
                <Tag icon={<CloseCircleOutlined/>} color={"error"}
                     onClick={() => message.error(intl.get('rejectApproveMessage', {name: msg}))}>
                    {intl.get('rejectApprove')}
                </Tag>
            )
        default:
            return (
                <Tag icon={<ExclamationCircleOutlined/>} color={"processing"}
                     onClick={() => message.info(intl.get('errorApproveMessage', {name: msg}))}>
                    {intl.get('errorApprove')}
                </Tag>
            )
    }
}
