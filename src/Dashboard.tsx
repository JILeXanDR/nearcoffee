import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from './auth.context';
import { useNear } from './near.hook';

// TODO: only for users with profile

export const Dashboard = (props) => {
    const nearAdapter = useNear();
    const auth = useAuth();

    const [loading, setLoading] = useState(true);
    const [supporters, setSupporters] = useState([]);

    useEffect(() => {
        if (!nearAdapter) {
            return;
        }
        nearAdapter.getSupporters(auth.accountId).then(list => {
            setSupporters(list);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    if (!auth.isSignedIn) {
        return <h1>You're not authorized to view this page</h1>;
    }

    if (loading) {
        return <h1>loading...</h1>;
    }

    return (
        <>
            <h3>Supporters</h3>
            <ol>
                {supporters.map((val, index) => <li key={index}>{val}</li>)}
            </ol>
        </>
    );
};
