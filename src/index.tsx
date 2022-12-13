import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import Token from "./Token";
import {Provider} from "react-redux";
import store from "./component/redux/store";
import ErrorBoundary from "./ErrorBoundary";


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <Provider store={store}>
                <Token/>
            </Provider>
        </ErrorBoundary>
    </React.StrictMode>
);
