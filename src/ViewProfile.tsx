import * as nearAPI from 'near-api-js';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useNear } from './near.hook';

export const ViewProfile = () => {
    const nearAdapter = useNear();
    const { profileId } = useParams();

    const [profile, setProfile] = useState('');
    const [loading, setLoading] = useState(true);

    const coffeePrice = useMemo(() => (profile ? (profile.coffee_price / 10 ** 24) : 0).toString(), [profile]);

    const butCoffee = async () => {
        try {
            const amount = nearAPI.utils.format.parseNearAmount(coffeePrice);
            await nearAdapter.buyCoffee(profileId, amount);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (!nearAdapter) {
            return;
        }

        const load = async () => {
            try {
                const res = await nearAdapter.getProfile(profileId);
                console.log({ getProfile: res });
                setProfile(res);
            } catch (e) {
                alert(e);
                console.error(e);
            }

            setLoading(false);
        };

        load().then(() => console.log('loading done'));
    }, [nearAdapter]);

    if (loading) {
        return <div>loading...</div>;
    }

    if (!profile) {
        return (
            <div>
                <h1>Profile {profileId} not found</h1>
            </div>
        );
    }

    return (
        <div>
            <div>
                <h1>You are on profile of {profileId} is {profile.description}</h1>
                <h3>Coffee price is Ⓝ{coffeePrice}</h3>
                <button onClick={butCoffee}>Buy coffee for {profileId}</button>
            </div>
        </div>
    );
};
