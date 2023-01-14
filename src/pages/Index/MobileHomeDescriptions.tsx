import React from "react";
import intl from "react-intl-universal";
import { Descriptions, Typography, Button } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const MobileHomeDescriptions: React.FC = () => {

    const navigate = useNavigate();

    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value)

    return (
        <Descriptions
            title={<div style={{ display: "flex" }}>
                <Title level={3}>你好，{userInfo.realeName}</Title>
                &nbsp;&nbsp;
                <Button type="primary" onClick={() => navigate('/m/login-record')}>登录记录</Button>
            </div>}
            bordered
            layout="vertical"
        >
            <Descriptions.Item label={'UID'}>
                {userInfo.uid}
            </Descriptions.Item>
            <Descriptions.Item label="用户名">
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

export default MobileHomeDescriptions;
