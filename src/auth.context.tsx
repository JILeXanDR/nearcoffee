import * as React from 'react';
import { useEffect, useState } from 'react';
import { useConfig } from '~config';
import { useNear } from '~near.adapter';

const AuthContext = React.createContext();

export const AuthProvider = (props) => {
    console.log('AuthProvider');

    const config = useConfig();
    const nearAdapter = useNear();
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [accountId, setAccountId] = useState('');

    console.log('useConfig', config);

    const login = async () => {
        try {
            const origin = window.location.origin;
            await nearAdapter.walletConnection.requestSignIn('', 'NEAR Coffee', `${origin}/dashboard`, origin);
        } catch (e) {
            alert(e.toString());
        }
    };

    const logout = async () => {
        await nearAdapter.walletConnection.signOut();
        setIsSignedIn(false);
        setAccountId('');
    };

    useEffect(() => {
        console.log('AuthProvider:useEffect');
        if (!nearAdapter) {
            return;
        }
        if (nearAdapter.walletConnection.isSignedIn()) {
            setIsSignedIn(true);
            setAccountId(nearAdapter.walletConnection.getAccountId());
        } else {
            setIsSignedIn(false);
            setAccountId('');
        }
    }, [nearAdapter]);

    // if (!nearAdapter) {
    //     const empty = {};
    //     return <AuthContext.Provider value={empty}/>;
    // }

    return (
        <AuthContext.Provider value={{ login, logout, isSignedIn, accountId }} {...props}/>
    );
};

export type Data = {
    isSignedIn: boolean;
    accountId: string;
    login: Function,
    logout: Function,
};

export const useAuth = (): Data => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error(`useAuth must be used within a AuthProvider`);
    }
    return context;
};
