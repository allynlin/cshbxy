
import intl from "react-intl-universal";
import {Tag} from "antd";
import React from "react";

export const RenderUserTypeTag = (text: string) => {
    switch (text) {
        case 'Department':
            return <Tag color='#ffa940'>{intl.get('department')}</Tag>
        case 'Leader':
            return <Tag color='#9254de'>{intl.get('leader')}</Tag>
        case 'Employee':
            return <Tag color='#7cb305'>{intl.get('employee')}</Tag>
        default:
            return <Tag color={"processing"}>{intl.get('unKnowUserType')}</Tag>
    }
}
