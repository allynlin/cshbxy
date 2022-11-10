/**
 *  渲染用户管理状态
 *  @param {string} status 状态。0：正常，1：被禁用
 *  @return {JSX.Element} 状态标签
 *  点击标签弹出全局 message，显示状态对应的文字
 *  update 2022-11-10
 */
import {Tag} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import React from "react";
import intl from "react-intl-universal";

import {blue, green, red} from "../../baseInfo";

export const RenderUserStatusTag = (status: string) => {
    switch (status) {
        case 'Normal':
        case '正常':
            return (
                <Tag icon={<CheckCircleOutlined/>} color={green}>
                    {intl.get('normal')}
                </Tag>
            )
        case 'Disabled':
        case '禁用':
            return (
                <Tag icon={<CloseCircleOutlined/>} color={red}>
                    {intl.get('disabled')}
                </Tag>
            )
        default:
            return (
                <Tag icon={<ExclamationCircleOutlined/>} color={blue}>
                    {intl.get('unKnowUserType')}
                </Tag>
            )
    }
}
