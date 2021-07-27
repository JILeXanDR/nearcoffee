import * as React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../auth.context';
import { CoffeeLayout } from './CoffeLayout';
import { Home } from '../pages/Home';
import { Index as User } from '../pages/user/Index';
import { ViewProfile } from '../pages/ViewProfile';

// const history = createBrowserHistory();

export const AppRouter = () => {
    const auth = useAuth();

    return (
        <BrowserRouter>
            <CoffeeLayout>
                <Switch>
                    <Route exact path="/" render={(props) => <Home/>}/>
                    <Route path="/user" render={(props) => {
                        if (!auth.isSignedIn) {
                            return (
                                <div className="p-4 text-center">
                                    <h1 className="text-2xl font-bold text-red-500">Connect NEAR wallet to view this page</h1>
                                </div>
                            );
                        }
                        return <User/>;
                    }}/>
                    <Route path="/:link" render={(props) => <ViewProfile/>}/>
                </Switch>
            </CoffeeLayout>
        </BrowserRouter>
    );
};
