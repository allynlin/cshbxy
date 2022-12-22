import React from 'react';
import {Link} from "react-router-dom";
import './result.scss'
import {Button, ErrorBlock} from 'antd-mobile';

export const Error404 = () => (
    <ErrorBlock
        status='empty'
        fullPage
        title={'404'}
        description={
            <span>页面已丢失</span>
        }
        className={'error-block'}
    >
        <Link to={'/m/home'}>
            <Button color="primary">返回首页</Button>
        </Link>
    </ErrorBlock>
)

export const Error403 = () => (
    <ErrorBlock
        status='disconnected'
        fullPage
        title={'403'}
        description={
            <span>您没有权限访问此页面</span>
        }
        className={'error-block'}
    >
        <Link to={'/m/home'}>
            <Button color="default">返回首页</Button>
        </Link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Link to={'/m/login'}>
            <Button color="primary">登录</Button>
        </Link>
    </ErrorBlock>
);

export const Error500 = () => (
    <ErrorBlock
        status='busy'
        fullPage
        title={'500'}
        description={
            <span>系统错误</span>
        }
        className={'error-block'}
    >
        <Link
            to={'/m/home'}>
            <Button color="default">返回首页</Button>
        </Link>
    </ErrorBlock>
)
