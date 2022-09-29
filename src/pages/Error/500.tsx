import {Button, Result} from 'antd';
import React from 'react';
import {useNavigate} from "react-router-dom";

const Error500 = () => {
    const navigate = useNavigate();
    const toHome = () => {
        const userType=localStorage.getItem('college_sys_userType')
        userType==='student'?navigate('/student-home', {replace: true}):navigate('/department-home', {replace: true})
    }
    return (
        <Result
            status="500"
            title="500"
            subTitle="很抱歉，我们遇到了一个错误"
            extra={<Button type="primary" onClick={toHome}>返回首页</Button>}
        />
    )
};

export default Error500;