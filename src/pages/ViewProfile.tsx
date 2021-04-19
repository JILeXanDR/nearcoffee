import * as nearAPI from 'near-api-js';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Loading } from '~components/Loading';
import { useConfig } from '~config';
import { useNear } from '~near.adapter';
import { useQuery } from '~utils';

export const ViewProfile = () => {
    const nearAdapter = useNear();
    const { link } = useParams();
    const { env } = useConfig();
    const query = useQuery();
    const errorCode = query.get('errorCode');
    const isProd = env === 'prod';

    const [profile, setProfile] = useState('');
    const [loading, setLoading] = useState(true);

    const coffeePrice = useMemo(() => (profile ? (profile.coffee_price / 10 ** 24) : 0).toString(), [profile]);
    // TODO: suffix based on env
    const profileId = useMemo(() => `${link}.${isProd ? 'near' : 'testnet'}`, [link]);

    const buyCoffee = async () => {
        try {
            const amount = nearAPI.utils.format.parseNearAmount(coffeePrice);
            await nearAdapter.buyOneCoffeeFor(profileId, amount);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        switch (errorCode) {
            case 'userRejected': {
                alert('Canceled');
                break;
            }
            default: {
            }
        }
    }, []);

    useEffect(() => {
        if (!nearAdapter) {
            return;
        }

        const load = async () => {
            try {
                const res = await nearAdapter.getProfileOf(profileId);
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
        return <Loading/>;
    }

    if (!profile) {
        return <h1>Profile <span className="font-bold">{profileId}</span> not found</h1>;
    }

    return (
        <div>
            <div>
                <h1>You are on profile of {profileId} is {profile.description}</h1>
                <button className="bg-blue-100 hover:bg-blue-200 rounded-md p-2" onClick={buyCoffee}>Buy coffee for {profileId} with coffee price is Ⓝ{coffeePrice}</button>
            </div>
        </div>
    );
};
