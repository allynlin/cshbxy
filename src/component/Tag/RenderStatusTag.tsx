import {Steps, Tag} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import React from "react";
import intl from "react-intl-universal";

export const RenderStatusTag = (item: any) => {

    const getItems = (count: number) => {

        const getTitle = (index: number) => {
            if (index > count) {
                return intl.get('waitApproval')
            }
            if (index === count) {
                return intl.get('approvaling')
            }
            return intl.get('approvalPass')
        }

        // 将 item.process 中的字符串按照 || 分割成数组
        return item.process.split('||').map((item: any, index: number) => {
            return {
                title: getTitle(index),
                description: getTitle(index)
            }
        });
    }

    const style = {
        overflow: "auto",
        width: "100%",
        height: "100%",
    }

    switch (item.status) {
        case 0:
            return (
                <div style={style}>
                    <Steps
                        style={{marginTop: 8}}
                        type="inline"
                        current={item.count}
                        status={"process"}
                        items={getItems(item.count)}
                    />
                </div>
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
                <Tag icon={<ExclamationCircleOutlined/>} color={"processing"}>
                    {intl.get('errorApprove')}
                </Tag>
            )
    }
}
