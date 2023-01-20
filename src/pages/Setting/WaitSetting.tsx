import React, {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {Progress, Result} from 'antd';
import {LoadingOutlined} from "@ant-design/icons";
import intl from "react-intl-universal";

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

const WaitSetting: React.FC = () => {
    const [percent, setPercent] = useState<number>(0);
    const [waitTime, setWaitTime] = useState<number>(0);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setWaitTime(location.state);
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (percent < 100) {
                // 生成一个 1-waitTime 的随机数
                const random = Math.random() * (waitTime - 1) + 1;
                // 对结果取 2 位小数
                const result = (percent + random).toFixed(2);
                setPercent(Number(result));
            } else {
                navigate(-1);
            }
        }, 500)
        return () => {
            clearTimeout(timer)
        }
    }, [percent])

    return (
        <Result
            icon={antIcon}
            title={intl.get('useSettingIng')}
            extra={<Progress percent={percent}/>}
        />
    )
}

export default WaitSetting;