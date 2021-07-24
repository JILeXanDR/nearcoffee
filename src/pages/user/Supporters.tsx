import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '~auth.context';
import { Card } from '~components/Card';
import { useConfig } from '~config';
import { Supporter, useNear } from '~near.adapter';

export const SupportersTab = () => {
    const auth = useAuth();
    const nearAdapter = useNear();
    const config = useConfig();

    const [loading, setLoading] = useState(true);
    const [supporters, setSupporters] = useState<Supporter[]>([]);

    useEffect(() => {
        nearAdapter.whoBoughtCoffeeFor(auth.accountId)
            .then(list => setSupporters(list))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <h1>loading...</h1>;
    }

    const makeWalletUrl = (account: Supporter): string => {
        return `${config.walletUrl}/profile/${account}`;
    };

    return (
        <>
            <Card>
                <h3>Supporters ({supporters.length})</h3>
                <ol>
                    {supporters.map((val, index) => {
                        return (
                            <li key={index}>
                                <a href={makeWalletUrl(val)} target="_blank">{val}</a>
                            </li>
                        );
                    })}
                </ol>
            </Card>
        </>
    );
};
