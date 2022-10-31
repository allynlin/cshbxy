import {UserOutlined} from '@ant-design/icons';
import {Avatar, Col, Divider, Row} from 'antd';
import React from 'react';
import './userInfo.scss'
import {useSelector} from "react-redux";
import intl from "react-intl-universal";

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
                    <Divider orientation="left">{intl.get('Base-info')}</Divider>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                            <div style={style}>{intl.get('UserName')}: {userInfo.realeName}</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div style={style}>{intl.get('Gender')}: {userInfo.gender}</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div style={style}>{intl.get('Tel')}: {userInfo.tel}</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div style={style}>{intl.get('Email')}: {userInfo.email}</div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
};

export default UserInfo;
