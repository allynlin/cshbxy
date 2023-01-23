import React from 'react';
import {Outlet} from 'react-router-dom';
import RenderTabBar from "./RenderTabBar";
import {useStyles} from "../../styles/mobileStyle";
import {useSelector} from "react-redux";
import ChangeSystem from "../../component/ChangeSystem";

const Home = () => {

    const classes = useStyles();

    const isShowFloatButton = useSelector((state: any) => state.isShowFloatButton.value);

    return (
        <>
            {isShowFloatButton ? <ChangeSystem/> : null}
            <div className={classes.mobileHomeBody}>
                <div className={classes.outlet}>
                    <Outlet/>
                </div>
                <div className={classes.tabBar}>
                    <RenderTabBar/>
                </div>
            </div>
        </>
    )
}

export default Home;
