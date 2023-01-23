import React, {useState} from 'react';
import {Button, Skeleton} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import intl from "react-intl-universal";
import {useStyles} from "./skeletonStyles";

const WebSkeleton: React.FC = () => {

    const classes = useStyles();

    const [isRenderRefreshButton, setIsRenderRefreshButton] = useState<boolean>(false);

    const location = useLocation();
    const navigate = useNavigate();

    // 10 秒后显示重新加载按钮
    setTimeout(() => {
        setIsRenderRefreshButton(true)
    }, 10000);

    const RenderRefreshButton = () => {
        return (
            <>
                <div className={classes.tipsFont}>{intl.get('loadingOutTimeTips-1')}</div>
                <Button type="primary" onClick={() => navigate(location.pathname)}>{intl.get('retry')}</Button>
            </>
        )
    }

    return (
        <>
            <Skeleton active/>
            {isRenderRefreshButton ? <RenderRefreshButton/> : null}
        </>
    )
}

export default WebSkeleton;