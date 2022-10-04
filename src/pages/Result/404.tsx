import {Button, Result} from 'antd';
import React from 'react';
import {Link} from "react-router-dom";

const Error404 = () => (
    <Result
        status="404"
        title="404"
        subTitle="您访问的页面不存在"
        extra={
            <Link to={'/home'}>
                <Button type="primary">返回首页</Button>
            </Link>
        }
    />
);

export default Error404;