import {Button, Result} from 'antd';
import React from 'react';
import {Link} from "react-router-dom";

const Error500 = () => (
    <Result
        status="500"
        title="500"
        subTitle="很抱歉，我们遇到了一个错误"
        extra={
            <Link to={'/home'}>
                <Button type="primary">返回首页</Button>
            </Link>
        }
    />
);

export default Error500;