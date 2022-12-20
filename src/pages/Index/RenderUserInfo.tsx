import {Alert, Button, Descriptions, Modal, Typography} from 'antd';
import React from 'react';
import './index.scss'
import {useSelector} from "react-redux";
import intl from "react-intl-universal";
import ShowTour from "./ShowTour";

const {Paragraph, Title} = Typography;

const Employee: React.FC = () => {

    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value)

    return (
        <div className={'index-body'}>
            <Alert
                message={intl.get('tips-1')}
                description={
                    <>
                        <Paragraph>{intl.get('tips-2')}</Paragraph>
                        <Paragraph>{intl.get('tips-3')}</Paragraph>
                        <Paragraph>{intl.get('tips-4')}</Paragraph>
                        <Paragraph>{intl.get('tips-5')}</Paragraph>
                        <Paragraph>{intl.get('tips-6')}</Paragraph>
                        <Button
                            type="primary"
                            target="_blank"
                            onClick={() => window.location.replace('https://cshbxy-mobile.netlify.app/')}
                            block
                        >{intl.get('changeToMobileTerminal')}</Button>
                    </>
                }
                type="info"
                closable
            />
            <Descriptions
                title={
                    <>
                        <Title level={3}>{intl.get('hello') + ',' + userInfo.realeName}</Title>
                        <ShowTour/>
                    </>
                }
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
        </div>
    )
};

export default Employee;
