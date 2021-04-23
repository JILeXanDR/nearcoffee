import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '~auth.context';
import { Profile, useNear } from '~near.adapter';
import { normalizeNearAmount } from '~utils';

export const DefaultTab = () => {
    const near = useNear();
    const { accountId } = useAuth();
    const [profile, setProfile] = useState<Profile>();

    const withdraw = () => {
    };

    useEffect(() => {
        near.getProfileOf(accountId)
            .then(profile => setProfile(profile))
            .catch(e => {

            })
            .finally();
    }, []);

    if (!profile) {
        return <h1>loading...</h1>;
    }

    return (
        <>
            <div>
                Your balance: {normalizeNearAmount(profile.balance)}
            </div>
            <div>
                <button className="bg-blue-100" onClick={withdraw}>Withdraw</button>
            </div>
        </>
    );
};
