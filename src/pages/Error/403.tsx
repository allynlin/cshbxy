import {Button, Result} from 'antd';
import React from 'react';
import {useNavigate} from "react-router-dom";

const Error403 = () => {
    const navigate = useNavigate();
    const toLogin = () => {
        navigate(`/login`)
    }
    return (
        <Result
            status="403"
            title="403"
            subTitle="您没有权限访问该页面"
            extra={<Button type="primary" onClick={toLogin}>登录</Button>}
        />
    )
};

export default Error403;