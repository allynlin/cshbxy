import {CloseCircleOutlined} from '@ant-design/icons';
import {Button, message, Result, Typography} from 'antd';
import React from 'react';
import {version, winTo} from "../../baseInfo";
import {useDispatch, useSelector} from "react-redux";
import {getVersion} from "../../component/axios/api";
import {setVersion} from "../../component/redux/serverVersionSlice";
import {useNavigate} from "react-router-dom";
import './VersionLow.scss'

const {Paragraph, Text} = Typography;

const VersionLow: React.FC = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const serverVersion = useSelector((state: {
        serverVersion: {
            value: string
        }
    }) => state.serverVersion.value);

    const getVer = () => {
        getVersion().then(res => {
            dispatch(setVersion(res.body))
            // 对比本地 version，如果本地版本低于服务器版本，就提示更新
            if (res.body > version) {
                message.warning("当前版本过低，请更新版本")
            } else {
                navigate('/login', {replace: true});
            }
        })
    }

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
            <Button type="primary" key="buy" onClick={() => {
                navigate('/login', {replace: true});
            }}>刷新后去登录</Button>,
            <Button key="console" onClick={() => {
                getVer()
            }}>
                重新获取服务器版本
            </Button>,
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