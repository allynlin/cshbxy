import React from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Result} from "antd-mobile";

const Index: React.FC = () => {

    const navigate = useNavigate();

    return (
        <Result
            status='info'
            title='请注意'
            description={
                <div style={{
                    lineHeight: '2',
                }}>
                    <p>移动端部分功能受限无法使用，如您需要使用全部功能，请前往 Web 端</p>
                    <p style={{fontWeight: "bold"}}>移动端仅支持以下功能</p>
                    <ul>
                        <li>用户查询，禁用，删除</li>
                        <li>申请记录查询，删除</li>
                        <li>通过审批</li>
                    </ul>
                    <Button
                        style={{marginTop: '16px'}}
                        block
                        color='primary'
                        onClick={() => navigate('/home')}
                    >
                        如需全部功能请前往 Web 端
                    </Button>
                </div>
            }
        />
    )
};

export default Index;
