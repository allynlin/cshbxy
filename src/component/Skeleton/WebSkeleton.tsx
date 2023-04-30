import React, {useState} from 'react';
import {Skeleton} from "antd";
import {useStyles} from "./skeletonStyles";

const WebSkeleton: React.FC = () => {

    const classes = useStyles();

    const [isRenderRefreshButton, setIsRenderRefreshButton] = useState<boolean>(false);

    // 10 秒后显示重新加载按钮
    setTimeout(() => {
        setIsRenderRefreshButton(true)
    }, 10000);

    const RenderRefreshButton = () => {
        return (<div className={classes.tipsFont}>当前网络环境不佳，建议寻找更好的网络环境以便获得更好的体验</div>)
    }

    return (
        <>
            <Skeleton active/>
            {isRenderRefreshButton ? <RenderRefreshButton/> : null}
        </>
    )
}

export default WebSkeleton;