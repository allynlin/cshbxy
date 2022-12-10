import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import Token from "./Token";
import {Provider} from "react-redux";
import store from "./component/redux/store";

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
