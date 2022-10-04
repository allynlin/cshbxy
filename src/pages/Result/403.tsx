import {Button, Result} from 'antd';
import React from 'react';
import {Link} from "react-router-dom";

const Error403 = () => (
    <Result
        status="403"
        title="403"
        subTitle="很抱歉，您没有权限访问该页面"
        extra={
            <Link to={'/login'}>
                <Button type="primary">登录</Button>
            </Link>
        }
    />
);

export default Error403;