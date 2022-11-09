import {Button, Result, Typography} from 'antd';
import React, {useEffect} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {version} from "../../baseInfo";
import RenderRefreshButton from "../../component/Version/RenderRefreshButton";
import {CloseCircleOutlined} from "@ant-design/icons";
import './103.scss'
import {RenderToggleLanguageSelect} from "../../component/Language/RenderToggleLanguageSelect";
import intl from "react-intl-universal";

const {Paragraph, Text} = Typography;

export const Error404 = () => {
    const userType = useSelector((state: any) => state.userType.value)
    return (
        <Result
            status="404"
            title="404"
            subTitle={intl.get('404Title')}
            extra={
                <Link
                    to={userType === 'Employee' ? '/home/employee' : userType === 'Department' ? '/home/department' : '/home/leader'}>
                    <Button type="primary">{intl.get('backToHome')}</Button>
                </Link>
            }
        />
    )
};

export const Error403 = () => (
    <Result
        status="403"
        title="403"
        subTitle={intl.get('403Title')}
        extra={
            <Link to={'/login'}>
                <Button type="primary">{intl.get('login')}</Button>
            </Link>
        }
    />
);

export const Error500 = () => {
    const userType = useSelector((state: any) => state.userType.value)
    return (<Result
            status="500"
            title="500"
            subTitle={intl.get('500Title')}
            extra={
                <Link
                    to={userType === 'Employee' ? '/home/employee' : userType === 'Department' ? '/home/department' : '/home/leader'}>
                    <Button type="primary">{intl.get('backToHome')}</Button>
                </Link>
            }
        />
    )
};

export const Error101: React.FC = () => {
    return (
        <Result
            status="error"
            title={intl.get('101Title')}
        >
            <div className="desc">
                <Paragraph>
                    <Text
                        strong
                        style={{
                            fontSize: 16,
                        }}
                    >
                        {intl.get('101Desc-1')}
                    </Text>
                </Paragraph>
                <Paragraph>
                    <CloseCircleOutlined className="site-result-demo-error-icon"/>
                    &nbsp;{intl.get('101Desc-2')}
                </Paragraph>
                <Paragraph>
                    <CloseCircleOutlined className="site-result-demo-error-icon"/>
                    &nbsp;{intl.get('101Desc-3')}
                </Paragraph>
                <Paragraph>
                    <CloseCircleOutlined className="site-result-demo-error-icon"/>
                    &nbsp;{intl.get('101Desc-4')}
                </Paragraph>
            </div>
        </Result>
    )
};

export const Error103 = () => {

    const navigate = useNavigate();

    const serverVersion = useSelector((state: any) => state.serverVersion.value);

    const serverLowVersion = useSelector((state: any) => state.serverLowVersion.value);

    useEffect(() => {
        if (version >= serverVersion) {
            navigate(-1)
        }
    }, [serverLowVersion])

    const RenderVersion = () => {
        return (
            <div>
                <Text>{intl.get('sysVersion')}</Text>
                <Text code>{version}</Text>
                &nbsp;&nbsp;
                <Text>{intl.get('supportLowVersion')}</Text>
                <Text code>{serverLowVersion}</Text>
            </div>
        )
    }

    return (
        <Result
            status="error"
            title={intl.get('lowVersion')}
            subTitle={<RenderVersion/>}
            extra={
                <>
                    {
                        version >= serverLowVersion ? <Button type="primary" key="console" onClick={() => {
                            navigate('/')
                        }}>{intl.get('backToHome')}</Button> : null
                    }
                    <RenderRefreshButton/>
                    <RenderToggleLanguageSelect/>
                </>
            }
        >
            <div className="desc">
                <Paragraph>
                    <Text
                        strong
                        style={{
                            fontSize: 16,
                        }}
                    >
                        {intl.get('103Desc-1')}
                    </Text>
                </Paragraph>
                <Paragraph>
                    <CloseCircleOutlined className="site-result-demo-error-icon"/>
                    &nbsp;{intl.get('103Desc-2')}&nbsp;
                    <a onClick={e => {
                        e.preventDefault();
                        window.location.reload();
                    }}>{intl.get('refresh')}</a>
                </Paragraph>
                <Paragraph>
                    <CloseCircleOutlined className="site-result-demo-error-icon"/>
                    &nbsp;{intl.get('103Desc-3')}
                    <a
                        href={'https://github.com/allynlin/cshbxy'}>GitHub</a>
                </Paragraph>
                <Paragraph>
                    <CloseCircleOutlined className="site-result-demo-error-icon"/>
                    &nbsp;{intl.get('103Desc-4')}
                </Paragraph>
            </div>
        </Result>
    )
};

export const Success: React.FC = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const {object} = location.state;

    return (
        <Result
            status="success"
            title={object.title}
            subTitle={object.describe}
            extra={
                <div>
                    <Link to={object.toURL}>
                        <Button type="primary" key="console">{object.toPage}</Button>
                    </Link>

                    {
                        object.againTitle ? <Button style={{marginLeft: '10px'}} key="again" onClick={() => {
                            navigate(-1)
                        }}>{object.againTitle}</Button> : ''
                    }
                </div>
            }
        />
    )
};
