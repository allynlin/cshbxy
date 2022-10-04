import {Button, Result} from 'antd';
import React from 'react';
import {Link, useNavigate, useLocation} from "react-router-dom";

const App: React.FC = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const {object} = location.state;

    return (
        <Result
            status="success"
            title={object.title}
            subTitle={object.describe}
            extra={[
                <Link to={object.toURL}>
                    <Button type="primary" key="console">{object.toPage}</Button>
                </Link>
                ,
                object.againTitle ? <Button key="again" onClick={() => {
                    navigate(-1)
                }}>{object.againTitle}</Button> : '',
            ]}
        />
    )
};

export default App;