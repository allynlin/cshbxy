import {Descriptions} from 'antd';
import React from 'react';
import './index.scss'
import {useSelector} from "react-redux";

const Leader: React.FC = () => {

    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value)

    return (
        <div className={'index-body'}>
            <Descriptions
                title={"您好！" + userInfo.realeName}
                bordered
                column={{xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1}}
            >
                <Descriptions.Item label={'UID'}>
                    {userInfo.uid}
                </Descriptions.Item>
                <Descriptions.Item label={'用户名'}>
                    {userInfo.username}
                </Descriptions.Item>
                <Descriptions.Item label={'姓名'}>
                    {userInfo.realeName}
                </Descriptions.Item>
                <Descriptions.Item label={'联系电话'}>
                    {userInfo.tel}
                </Descriptions.Item>
                <Descriptions.Item label={'Email'}>
                    {userInfo.email}
                </Descriptions.Item>
                <Descriptions.Item label={'创建时间'}>
                    {userInfo.create_time}
                </Descriptions.Item>
                <Descriptions.Item label={'更新时间'}>
                    {userInfo.update_time}
                </Descriptions.Item>
                <Descriptions.Item label={'状态'}>
                    {userInfo.status === 0 ? '正常' : '异常'}
                </Descriptions.Item>
            </Descriptions>
        </div>
    )
};

export default Leader;
