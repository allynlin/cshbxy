/**
 *  渲染状态标签
 *  @param {string} status 状态。0：待审核，1：审核通过，2：审核不通过
 *  @return {JSX.Element} 状态标签
 *  点击标签弹出全局 message，显示状态对应的文字
 *  update 2022-10-07
 */
import {message, Progress, Tag} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SyncOutlined} from "@ant-design/icons";
import React from "react";
import intl from "react-intl-universal";

export const RenderStatusTag = (item: any, msg = intl.get('apply')) => {

    const getProcess = () => {
        // 将 item.process 中的字符串按照 || 分割成数组
        const process = item.process.split('||');
        // 获取数组中有多少个元素
        const processLength = process.length;
        // 将元素 / item.count 的值返回
        return item.count / processLength * 100;
    }

    const getSteps = () => {
        // 将 item.process 中的字符串按照 || 分割成数组
        const process = item.process.split('||');
        // 返回数组中有多少个元素
        return process.length;
    }

    switch (item.status) {
        case 0:
            return (
                <div className={'status-tag'}>
                    <Tag icon={<SyncOutlined spin/>} color={"warning"}
                         onClick={() => message.warning(intl.get('underApproveMessage', {name: msg}))}>
                        {intl.get('underApprove')}
                    </Tag>
                    <Progress percent={getProcess()} steps={getSteps()}/>
                </div>
            )
        case 1:
            return (
                <div className={'status-tag'}>
                    <Tag icon={<CheckCircleOutlined/>} color={"success"}
                         onClick={() => message.success(intl.get('passApproveMessage', {name: msg}))}>
                        {intl.get('passApprove')}
                    </Tag>
                    <Progress percent={100} steps={getSteps()}/>
                </div>
            )
        case 2:
            return (
                <div className={'status-tag'}>
                    <Tag icon={<CloseCircleOutlined/>} color={"error"}
                         onClick={() => message.error(intl.get('rejectApproveMessage', {name: msg}))}>
                        {intl.get('rejectApprove')}
                    </Tag>
                    <Progress percent={getProcess()} steps={getSteps()} status="exception"/>
                </div>
            )
        default:
            return (
                <div className={'status-tag'}>
                    <Tag icon={<ExclamationCircleOutlined/>} color={"processing"}
                         onClick={() => message.info(intl.get('errorApproveMessage', {name: msg}))}>
                        {intl.get('errorApprove')}
                    </Tag>
                    <Progress percent={0} steps={getSteps()} status="exception"/>
                </div>
            )
    }
}
