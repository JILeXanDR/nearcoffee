import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '~auth.context';
import { MyPublicProfileLink } from '~components/MyPublicProfileLink';
import { useNear } from '~near.adapter';

// TODO: only for users with connected wallet (is_signed = true)

export const Dashboard = (props) => {
    const nearAdapter = useNear();
    const auth = useAuth();

    const [loading, setLoading] = useState(true);
    const [supporters, setSupporters] = useState([]);

    useEffect(() => {
        if (!auth.isSignedIn) {
            return;
        }
        nearAdapter.whoBoughtCoffeeFor(auth.accountId)
            .then(list => setSupporters(list))
            .finally(() => setLoading(false));
    }, [auth]);

    if (!auth.isSignedIn) {
        return (
            <div>
                <h1>You're not authorized to view this page</h1>
                <button onClick={auth.login}>Login with NEAR account</button>
            </div>
        );
    }

    if (loading) {
        return <h1>loading...</h1>;
    }

    return (
        <div>
            <h3>Supporters</h3>
            <MyPublicProfileLink/>
            <ol>
                {supporters.map((val, index) => <li key={index}>{val}</li>)}
            </ol>
        </div>
    );
};
