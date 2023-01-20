import {LoadingOutlined} from "@ant-design/icons";
import React from "react";
import {useStyles} from "./style";

interface LoadingIconProps {
    spin?: boolean
    size?: number
}

export const LoadingIcon: React.FC<LoadingIconProps> = (props) => {

    // CSSInJS
    const classes = useStyles();

    return (
        <div className={classes.fullScreen}>
            <LoadingOutlined style={{fontSize: props?.size || 24}} spin={props?.spin || true}/>
        </div>
    )
}