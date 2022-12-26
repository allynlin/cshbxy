import React from 'react';
import {Link} from "react-router-dom";
import {Button, ErrorBlock} from 'antd-mobile';
import {useStyles} from "../../styles/mobileStyle";

export const Error404 = () => {

    const classes = useStyles();

    return (
        <ErrorBlock
            status='empty'
            fullPage
            title={'404'}
            description={
                <span>页面已丢失</span>
            }
            className={classes.errorBlock}
        >
            <Link to={'/m/home'}>
                <Button color="primary">返回首页</Button>
            </Link>
        </ErrorBlock>
    )
}

export const Error403 = () => {

    const classes = useStyles();

    return (
        <ErrorBlock
            status='disconnected'
            fullPage
            title={'403'}
            description={
                <span>您没有权限访问此页面</span>
            }
            className={classes.errorBlock}
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
}

export const Error500 = () => {

    const classes = useStyles();

    return (
        <ErrorBlock
            status='busy'
            fullPage
            title={'500'}
            description={
                <span>系统错误</span>
            }
            className={classes.errorBlock}
        >
            <Link
                to={'/m/home'}>
                <Button color="default">返回首页</Button>
            </Link>
        </ErrorBlock>
    )
}
