import { createBrowserHistory } from 'history';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { App } from './App';
import { AuthProvider } from './auth.context';

const history = createBrowserHistory();

ReactDOM.render((
        <AuthProvider>
            <Router history={history}>
                <App/>
            </Router>
        </AuthProvider>
    ), document.getElementById('root'),
);
