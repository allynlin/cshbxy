import React, {useEffect} from 'react';
import './mobile.scss'
import {Outlet, useNavigate} from 'react-router-dom';
import {useSelector} from "react-redux";
import {version} from "../../baseInfo";
import {ExclamationCircleOutline,} from "antd-mobile-icons";
import RenderTabBar from "./RenderTabBar";
import {Toast} from "antd-mobile";

const Home = () => {

    const navigate = useNavigate();

    const serverVersion = useSelector((state: any) => state.serverVersion.value);

    const serverLowVersion = useSelector((state: any) => state.serverLowVersion.value);

    useEffect(() => {
        if (serverLowVersion === "0.0.0") {
            return;
        }
        if (version < serverLowVersion) {
            navigate('/m/103')
        }
        if (version < serverVersion) {
            Toast.show({
                content: '您当前使用的版本过低，请及时更新',
                icon: <ExclamationCircleOutline/>,
            })
        }
    }, [serverLowVersion, serverVersion])

    return (
        <div className={'home-body'}>
            <div className="out">
                <Outlet/>
            </div>
            <div className="tabBar">
                <RenderTabBar/>
            </div>
        </div>
    )
}

export default Home;
