import React from 'react';
import { useEffect, useState } from 'react';
import { useNear } from './near.adapter';

const AuthContext = React.createContext<AuthData | undefined>(undefined);

type Props = {
    children: any;
}

export const AuthProvider = (props: Props) => {
    console.log('AuthProvider');

    const nearAdapter = useNear();
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [accountId, setAccountId] = useState('');

    const login = async () => {
        try {
            const { origin: host, href: url } = window.location;
            await nearAdapter.walletConnection.requestSignIn({
                // successUrl: `${host}/dashboard`,
                successUrl: url,
                failureUrl: url,
            });
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

    return (
        <AuthContext.Provider value={{ login, logout, isSignedIn, accountId }} {...props}/>
    );
};

export type AuthData = {
    isSignedIn: boolean;
    // NEAR account id (name.near)
    accountId: string;
    login: () => {},
    logout: () => {},
}

export const useAuth = (): AuthData => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error(`useAuth must be used within a AuthProvider`);
    }
    return context;
};
