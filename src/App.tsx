import { createBrowserHistory } from 'history';
import * as React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '~auth.context';
import { LayoutWithHeader } from '~components/LayoutWithHeader';
import { Dashboard } from '~pages/Dashboard';
import { Home } from '~pages/Home';
import { ViewProfile } from '~pages/ViewProfile';

const history = createBrowserHistory();

export const App = () => {
    return (
        <React.StrictMode>
            <AuthProvider>
                <BrowserRouter history={history}>
                    <LayoutWithHeader>
                        <Switch>
                            <Route exact path="/" render={(props) => <Home {...props} />}/>
                            <Route path="/dashboard" render={(props) => <Dashboard {...props} />}/>
                            <Route path="/:link" render={(props) => <ViewProfile {...props}/>}/>
                        </Switch>
                    </LayoutWithHeader>
                </BrowserRouter>
            </AuthProvider>
        </React.StrictMode>
    );
};
