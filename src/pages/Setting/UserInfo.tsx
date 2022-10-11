import {UserOutlined, EllipsisOutlined, SettingOutlined} from '@ant-design/icons';
import {Avatar, Card, Typography, Divider, Row, Col} from 'antd';
import React from 'react';
import './userInfo.scss'
import {useSelector} from "react-redux";

const {Paragraph} = Typography;

const style: React.CSSProperties = {padding: '8px 0'};

const UserInfo: React.FC = () => {

    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value)

    return (
        <div className={'user-body'}>
            <div className={'Avatar'}>
                <div className={"image"}>
                    <Avatar shape="square" icon={<UserOutlined/>} size={100}/>
                </div>
                <div className={"capte"}>
                    <div className="show">
                    </div>
                </div>
            </div>
            <div className={'info'}>
                <div className="base-info">
                    <Divider orientation="left">基本信息</Divider>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                            <div style={style}>姓名：{userInfo.realeName}</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div style={style}>性别：{userInfo.gender}</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div style={style}>联系电话：{userInfo.tel}</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div style={style}>电子邮件：{userInfo.email}</div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
};

export default UserInfo;