import {Skeleton} from "antd";
import React from "react";
import {useStyles} from "../styles/webStyle";

export const RenderVirtualTableSkeleton = () => {

    const classes = useStyles();

    return (
        <>
            <div className={classes.skeletonThead}/>
            <div className={classes.skeletonTbody}>
                <Skeleton.Button block active className={classes.skeletonTbodyTr}/>
                <Skeleton.Button block active className={classes.skeletonTbodyTr}/>
                <Skeleton.Button block active className={classes.skeletonTbodyTr}/>
                <Skeleton.Button block active className={classes.skeletonTbodyTr}/>
                <Skeleton.Button block active className={classes.skeletonTbodyTr}/>
            </div>
        </>
    )
}
