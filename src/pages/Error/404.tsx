import {Button, Result} from 'antd';
import React from 'react';
import {useNavigate} from "react-router-dom";

const Error404 = () => {
    const navigate = useNavigate();
    return (
        <Result
            status="404"
            title="404"
            subTitle="当前页面不存在"
            extra={<Button type="primary" onClick={() => {
                navigate('/home', {replace: true})
            }}>返回首页</Button>}
        />
    )
};

export default Error404;