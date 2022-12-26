import React from 'react';
import {Outlet} from 'react-router-dom';
import RenderTabBar from "./RenderTabBar";
import {useStyles} from "../../styles/mobileStyle";

const Home = () => {

    const classes = useStyles();

    return (
        <div className={classes.mobileHomeBody}>
            <div className={classes.outlet}>
                <Outlet/>
            </div>
            <div className={classes.tabBar}>
                <RenderTabBar/>
            </div>
        </div>
    )
}

export default Home;
