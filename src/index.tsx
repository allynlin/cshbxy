import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss'
import App from './App';
import {Provider, useSelector} from "react-redux";
import store from "./component/redux/store";
import 'tdesign-react/es/style/index.css';


import {ConfigProvider} from "antd";


const Component = () => {
    const [prefix, setPrefix] = useState("custom-light");

    const themeColor = useSelector((state: {
        themeColor: {
            value: 'light' | 'dark'
        }
    }) => state.themeColor.value)

    useEffect(() => {
        switch (themeColor) {
            case 'dark':
                setPrefix('custom-dark')
                break;
            case 'light':
                setPrefix('custom-light')
                break;
            default:
                setPrefix('custom-light')
        }
    }, [themeColor])

    return (
        <ConfigProvider prefixCls={prefix}>
            <App/>
        </ConfigProvider>
    );
};

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
            {/*<Component/>*/}
        </Provider>
    </React.StrictMode>
);
