import * as React from 'react';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { useAuth } from './auth.context';
import { Dashboard } from './Dashboard';
import { Debug } from './Debug';
import { MyPublicProfileLink } from './MyPublicProfileLink';
import { ViewProfile } from './ViewProfile';
import { Welcome } from './Welcome';

export const App = () => {
    console.log('App');

    // const { near } = useNear(config.contractName);
    const { isSignedIn, login, logout } = useAuth();

    return (
        <div>
            <div>
                {isSignedIn && <button onClick={logout}>Logout</button>}
                {!isSignedIn && <button onClick={login}>Login with NEAR account</button>}
            </div>
            <div>
                <ul>
                    <li>
                        <Link to="/">Welcome</Link>
                    </li>
                    <li>
                        <Link to="/dashboard">Dashboard</Link>
                    </li>
                    {isSignedIn && <li><MyPublicProfileLink/></li>}
                </ul>
            </div>
            <div>
                <Switch>
                    <Route exact path="/" component={Welcome}/>
                    <Route exact path="/dashboard" component={Dashboard}/>
                    <Route path="/:profileId" component={ViewProfile}/>
                </Switch>
            </div>
            <Debug/>
        </div>
    );
};

const SecuredRoute = (props) => {
    const auth = useAuth();
    if (!auth.isSignedIn) {
        return <h1>You're not authorized to view this page</h1>;
    }
    return (
        <Route render={props.children}/>
    );
    // return (
    //     <Route render={(props) => (
    //         auth.isSignedIn === true ? props.children : <Redirect to={{ pathname: '/', state: {} }}/>
    //     )}/>
    // );
};
