/**
 * 根据数值返回对应的颜色
 * @param {number} status 状态。0：待审核，1：审核通过，2：审核不通过
 * @return {string} 颜色
 * update 2022-10-07
 */
import {lime7, orange5, purple} from "../../baseInfo";
import intl from "react-intl-universal";
import {Tag} from "antd";
import React from "react";

export const RenderUserTypeTag = (text: string) => {
    switch (text) {
        case 'Department':
            return <Tag color={orange5}>{intl.get('department')}</Tag>
        case 'Leader':
            return <Tag color={purple}>{intl.get('leader')}</Tag>
        case 'Employee':
            return <Tag color={lime7}>{intl.get('employee')}</Tag>
        default:
            return <Tag color={"processing"}>{intl.get('unKnowUserType')}</Tag>
    }
}
