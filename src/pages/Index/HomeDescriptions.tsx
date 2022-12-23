import React from "react";
import intl from "react-intl-universal";
import ShowTour from "./ShowTour";
import {Descriptions, Typography} from "antd";
import {useSelector} from "react-redux";

const {Title} = Typography;

const HomeDescriptions: React.FC = () => {

    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value)

    return (
        <Descriptions
            title={
                <>
                    <Title level={3}>{intl.get('hello') + ',' + userInfo.realeName}</Title>
                    <ShowTour/>
                </>
            }
            bordered
            layout="vertical"
            style={{
                padding: '16px 0',
            }}
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
    )
}

export default HomeDescriptions;
