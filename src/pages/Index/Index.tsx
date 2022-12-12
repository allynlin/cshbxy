import React from 'react';
import './index.scss'
import {useSelector} from "react-redux";
import RenderTips from "./RenderTips";
import RenderUserInfo from "./RenderUserInfo";

const Index: React.FC = () => {

    const isLogin = useSelector((state: any) => state.isLogin.value)

    return (
        isLogin ? <RenderUserInfo/> : <RenderTips/>
    )
};

export default Index;
