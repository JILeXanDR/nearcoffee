import * as React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '~auth.context';
import { ConnectWalletButton } from '~components/ConnectWalletButton';

export const ConnectOrDashboard = () => {
    const auth = useAuth();

    return (
        auth.isSignedIn ? <Link to="/dashboard">Go to dashboard</Link> : <ConnectWalletButton onClick={auth.login}/>
    );
};
