import * as React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './auth.context';

export const MyPublicProfileLink = () => {
    const { accountId, isSignedIn } = useAuth();
    const link = `/${accountId}`;
    if (!isSignedIn) {
        throw new Error(`MyPublicProfileLink must be used when signed in`);
    }
    return (
        <Link to={link}>My public profile</Link>
    );
};
