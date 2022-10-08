import {CloseCircleOutlined} from '@ant-design/icons';
import {Button, Result, Typography} from 'antd';
import React, {useEffect} from 'react';
import {version} from "../../baseInfo";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import RenderRefreshButton from "../../component/Version/RenderRefreshButton";
import './103.scss'

const {Paragraph, Text} = Typography;

const VersionLow: React.FC = () => {

    const navigate = useNavigate();

    const serverVersion = useSelector((state: {
        serverVersion: {
            value: string
        }
    }) => state.serverVersion.value);

    useEffect(() => {
        if (version >= serverVersion) {
            navigate(-1)
        }
    }, [serverVersion])

    const RenderVersion = () => {
        return (
            <div>
                <Text>当前版本：</Text>
                <Text code>{version}</Text>
                &nbsp;&nbsp;
                <Text>服务器版本：</Text>
                <Text code>{serverVersion}</Text>
            </div>
        )
    }

    return (<Result
        status="error"
        title={`版本过低`}
        subTitle={<RenderVersion/>}
        extra={[
            version >= serverVersion ? <Button type="primary" key="console" onClick={() => {
                navigate(-1)
            }}>返回</Button> : null,
            <RenderRefreshButton/>
        ]}
    >
        <div className="desc">
            <Paragraph>
                <Text
                    strong
                    style={{
                        fontSize: 16,
                    }}
                >
                    可能造成您版本过低的原因有：
                </Text>
            </Paragraph>
            <Paragraph>
                <CloseCircleOutlined className="site-result-demo-error-icon"/>
                &nbsp;您经常使用本系统，浏览器已经缓存了旧版本，您可以尝试清除浏览器缓存或
                <a onClick={e => {
                    e.preventDefault();
                    // @ts-ignore
                    window.location.reload(true);
                }}>强制刷新页面</a>
            </Paragraph>
            <Paragraph>
                <CloseCircleOutlined className="site-result-demo-error-icon"/>
                &nbsp;当前服务通道已经暂停维护，请使用其他正在维护的服务通道 <a
                href={'https://github.com/allynlin/cshbxy'}>GitHub</a>
            </Paragraph>
            <Paragraph>
                <CloseCircleOutlined className="site-result-demo-error-icon"/>
                &nbsp;您的服务提供商已经很久没有更新版本，请联系服务提供商更新版本
            </Paragraph>
        </div>
    </Result>)
};

export default VersionLow;