import {Button, Result} from 'antd';
import React from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";

export const Error404 = () => (
    <Result
        status="404"
        title="404"
        subTitle="您访问的页面不存在"
        extra={
            <Link
                to={'/home'}>
                <Button type="primary">返回首页</Button>
            </Link>
        }
    />
)

export const Error403 = () => (
    <Result
        status="403"
        title="403"
        subTitle="您没有权限访问此页面"
        extra={
            <Link to={'/login'}>
                <Button type="primary">去登录</Button>
            </Link>
        }
    />
);

export const Error500 = () => (<Result
        status="500"
        title="500"
        subTitle="服务器出错了"
        extra={
            <Link
                to={'/home'}>
                <Button type="primary">返回首页</Button>
            </Link>
        }
    />
)

export const Success: React.FC = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const {object} = location.state;

    return (
        <Result
            status="success"
            title={object.title}
            subTitle={object.describe}
            extra={
                <div>
                    <Link to={object.toURL}>
                        <Button type="primary" key="console">{object.toPage}</Button>
                    </Link>

                    {
                        object.againTitle ? <Button style={{marginLeft: '10px'}} key="again" onClick={() => {
                            navigate(-1)
                        }}>{object.againTitle}</Button> : ''
                    }
                </div>
            }
        />
    )
};
