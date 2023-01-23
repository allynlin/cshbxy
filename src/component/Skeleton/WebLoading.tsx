import React, {useState} from 'react';
import {LoadingOutlined} from '@ant-design/icons';
import {Button, Spin} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import intl from "react-intl-universal";
import {useStyles} from "./skeletonStyles";

const antIcon = <LoadingOutlined style={{fontSize: 48}} spin/>;

const WebLoading: React.FC = () => {

    const classes = useStyles();

    const [tips, setTips] = useState<JSX.Element>(<div className={classes.tipsFont}>{intl.get('loading')}</div>);

    const location = useLocation();
    const navigate = useNavigate();

    // 10 秒后显示重新加载按钮
    setTimeout(() => {
        setTips(<>
            <div className={classes.tipsFont}>{intl.get('loadingOutTimeTips-1')}</div>
            <Button type="primary" onClick={() => navigate(location.pathname)}>{intl.get('retry')}</Button>
        </>);
    }, 10000);

    return (
        <div className={classes.fullScreen}>
            <Spin indicator={antIcon} tip={tips} delay={500}/>
        </div>
    )
}

export default WebLoading;