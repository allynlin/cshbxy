import React from 'react';
import {useSelector} from "react-redux";
import RenderWeb from "./RenderWeb";
import RenderResult from "./RenderResult";

const Web: React.FC = () => {

    const isRenderWeb = useSelector((state: any) => state.isRenderWeb.value);

    return (
        isRenderWeb ? <RenderWeb/> : <RenderResult/>
    );
};

export default Web;
