import React, {useState} from 'react';
import {LoadingOutlined} from '@ant-design/icons';
import {Spin} from "antd";
import {useStyles} from "./skeletonStyles";

const antIcon = <LoadingOutlined style={{fontSize: 48}} spin/>;

const WebLoading: React.FC = () => {

    const classes = useStyles();

    const [tips, setTips] = useState<JSX.Element>(<div className={classes.tipsFont}>正在加载中……</div>);

    // 10 秒后显示重新加载按钮
    setTimeout(() => {
        setTips(<div
            className={classes.tipsFont}>当前网络环境不佳，建议寻找更好的网络环境以便获得更好的体验
        </div>);
    }, 10000);

    return (
        <div className={classes.fullScreen}>
            <Spin indicator={antIcon} tip={tips} delay={500}/>
        </div>
    )
}

export default WebLoading;