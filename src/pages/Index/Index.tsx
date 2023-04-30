import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {useStyles} from "../../styles/webStyle";
import HomeDescriptions from "./HomeDescriptions";

const {useNavigate} = require("react-router-dom");

const Index: React.FC = () => {

    const isLogin = useSelector((state: any) => state.isLogin.value)
    const navigator = useNavigate()
    const classes = useStyles();

    useEffect(() => {
        if (!isLogin) navigator('/login')
    }, [isLogin])

    return (
        isLogin ? <div className={classes.webHomeBody}>
            <HomeDescriptions/>
        </div> : <></>
    )
};

export default Index;
