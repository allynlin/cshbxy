import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from "react-redux";

import './index.css';
import Token from "./Token";
import store from "./component/redux/store";

import 'antd/dist/reset.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <Token/>
        </Provider>
    </React.StrictMode>
);
