import {Descriptions} from 'antd';
import React from 'react';
import './index.scss'
import {useSelector} from "react-redux";
import intl from "react-intl-universal";

const Employee: React.FC = () => {

    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value)

    return (
        <div className={'index-body'}>
            <Descriptions
                title={intl.get('hello') + ',' + userInfo.realeName}
                bordered
                column={{xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1}}
            >
                <Descriptions.Item label={'UID'}>
                    {userInfo.uid}
                </Descriptions.Item>
                <Descriptions.Item label={intl.get('username')}>
                    {userInfo.username}
                </Descriptions.Item>
                <Descriptions.Item label={intl.get('realName')}>
                    {userInfo.realeName}
                </Descriptions.Item>
                <Descriptions.Item label={intl.get('gender')}>
                    {userInfo.gender}
                </Descriptions.Item>
                <Descriptions.Item label={intl.get('tel')}>
                    {userInfo.tel}
                </Descriptions.Item>
                <Descriptions.Item label={intl.get('email')}>
                    {userInfo.email}
                </Descriptions.Item>
                <Descriptions.Item label={intl.get('createTime')}>
                    {userInfo.create_time}
                </Descriptions.Item>
                <Descriptions.Item label={intl.get('updateTime')}>
                    {userInfo.update_time}
                </Descriptions.Item>
                <Descriptions.Item label={intl.get('status')}>
                    {userInfo.status === 0 ? intl.get('normal') : intl.get('disabled')}
                </Descriptions.Item>
                {userInfo.departmentUid ? <Descriptions.Item label={intl.get('department')}>
                    {userInfo.departmentUid}
                </Descriptions.Item> : null}
            </Descriptions>
        </div>
    )
};

export default Employee;
