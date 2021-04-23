import { createBrowserHistory } from 'history';
import * as React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '~auth.context';
import { CoffeeLayout } from '~components/CoffeLayout';
import { Index as Dashboard } from '~pages/Dashboard/Index';
import { Home } from '~pages/Home';
import { ViewProfile } from '~pages/ViewProfile';

const history = createBrowserHistory();

export const AppRouter = () => {
    const auth = useAuth();

    return (
        <BrowserRouter>
            <CoffeeLayout>
                <Switch>
                    <Route exact path="/" render={(props) => <Home/>}/>
                    <Route path="/dashboard" render={(props) => {
                        if (!auth.isSignedIn) {
                            return (
                                <div className="p-4 text-center">
                                    <h1 className="text-2xl font-bold text-red-500">Connect NEAR wallet to view this page</h1>
                                </div>
                            );
                        }
                        return <Dashboard/>;
                    }}/>
                    <Route path="/:link" render={(props) => <ViewProfile/>}/>
                </Switch>
            </CoffeeLayout>
        </BrowserRouter>
    );
};
