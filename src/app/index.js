import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import {BrowserRouter as Router} from "react-router-dom";

import App from './App.js';

import { store } from './redux/index.js';

render(
    (
        <Provider store={store}>
            <Router>
                <App />
            </Router>
        </Provider>
    )
    , document.getElementById('app')
);