import {LoadingOutlined} from '@ant-design/icons';
import {Spin} from 'antd';
import './Spin.scss'
import React from 'react';

const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 40,
        }}
        spin
    />
);

const App = () => <Spin indicator={antIcon} delay={500}/>;

export default App;