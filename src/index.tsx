import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App';
import {Provider} from "react-redux";
import store from "./component/redux/store";
import zhCN from 'antd/es/locale/zh_CN';
import {ConfigProvider} from 'antd';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ConfigProvider locale={zhCN}>
                <App/>
            </ConfigProvider>
        </Provider>
    </React.StrictMode>
);
