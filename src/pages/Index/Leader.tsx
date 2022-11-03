import {Descriptions} from 'antd';
import React, {useEffect, useState} from 'react';
import './index.scss'
import {useSelector} from "react-redux";
import {getRealeName} from "../../component/axios/api";

const Teacher: React.FC = () => {

    const [leaderName, setLeaderName] = useState<string>('');

    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value)

    const getName = () => {
        if (userInfo.leaderUid) {
            const depa = userInfo.leaderUid;
            getRealeName(depa).then(res => {
                setLeaderName(res.body);
            })
        }
    }

    useEffect(() => {
        getName()
    }, [userInfo])

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

export default Teacher;
