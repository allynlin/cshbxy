import {Button, Result} from 'antd';
import React from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import intl from "react-intl-universal";

export const Error404 = () => (
    <Result
        status="404"
        title="404"
        subTitle={intl.get('404Title')}
        extra={
            <Link
                to={'/home'}>
                <Button type="primary">{intl.get('backToHome')}</Button>
            </Link>
        }
    />
)

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

export const Error500 = () => (<Result
        status="500"
        title="500"
        subTitle={intl.get('500Title')}
        extra={
            <Link
                to={'/home'}>
                <Button type="primary">{intl.get('backToHome')}</Button>
            </Link>
        }
    />
)

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
