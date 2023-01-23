import React, {useState} from 'react';
import {AutoCenter, Button, DotLoading} from 'antd-mobile'
import {useLocation, useNavigate} from "react-router-dom";
import intl from "react-intl-universal";
import {useStyles} from "./skeletonStyles";

const MobileLoading: React.FC = () => {

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
                <Button block color='primary' fill='solid'
                        onClick={() => navigate(location.pathname)}>{intl.get('retry')}</Button>
            </>
        )
    }

    return (
        <div className={classes.fullScreen}>
            <span style={{fontSize: 24}}>
                <AutoCenter><DotLoading/></AutoCenter>
                {isRenderRefreshButton ? <RenderRefreshButton/> : null}
            </span>
        </div>
    )
}

export default MobileLoading;