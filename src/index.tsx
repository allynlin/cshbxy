import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from "react-redux";
import {StyleProvider, legacyLogicalPropertiesTransformer} from '@ant-design/cssinjs';

import './index.css';
import store from "./component/redux/store";

import App from "./App";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
                <App/>
            </StyleProvider>
        </Provider>
    </React.StrictMode>
);
