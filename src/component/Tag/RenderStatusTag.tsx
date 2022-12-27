import {Progress, Tag} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SyncOutlined} from "@ant-design/icons";
import React from "react";
import intl from "react-intl-universal";

export const RenderStatusTag = (item: any) => {

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

    const styles: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }

    switch (item.status) {
        case 0:
            return (
                <div style={styles}>
                    <Tag icon={<SyncOutlined spin/>} color={"warning"}>
                        {intl.get('underApprove')}
                    </Tag>
                    <Progress percent={getProcess()} steps={getSteps()}/>
                </div>
            )
        case 1:
            return (
                <div style={styles}>
                    <Tag icon={<CheckCircleOutlined/>} color={"success"}>
                        {intl.get('passApprove')}
                    </Tag>
                    <Progress percent={100} steps={getSteps()}/>
                </div>
            )
        case 2:
            return (
                <div style={styles}>
                    <Tag icon={<CloseCircleOutlined/>} color={"error"}>
                        {intl.get('rejectApprove')}
                    </Tag>
                    <Progress percent={getProcess()} steps={getSteps()} status="exception"/>
                </div>
            )
        default:
            return (
                <div style={styles}>
                    <Tag icon={<ExclamationCircleOutlined/>} color={"processing"}>
                        {intl.get('errorApprove')}
                    </Tag>
                    <Progress percent={0} steps={getSteps()} status="exception"/>
                </div>
            )
    }
}
