import React from "react";
import {Descriptions, Typography} from "antd";
import {useSelector} from "react-redux";

const {Title} = Typography;

const HomeDescriptions: React.FC = () => {

    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value)
    return (
        <Descriptions
            title={<div style={{display: "flex"}}>
                <Title level={3}>{'你好,' + userInfo.realeName}</Title>
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
            <Descriptions.Item label="真实姓名">
                {userInfo.realeName}
            </Descriptions.Item>
            <Descriptions.Item label="性别">
                {userInfo.gender}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">
                {userInfo.tel}
            </Descriptions.Item>
            <Descriptions.Item label="电子邮件地址">
                {userInfo.email}
            </Descriptions.Item>
            <Descriptions.Item label="用户创建时间">
                {userInfo.create_time}
            </Descriptions.Item>
            <Descriptions.Item label="最后更新时间">
                {userInfo.update_time}
            </Descriptions.Item>
            {userInfo.departmentUid ? <Descriptions.Item label="所属部门">
                {userInfo.departmentUid}
            </Descriptions.Item> : null}
        </Descriptions>
    )
}

export default HomeDescriptions;
