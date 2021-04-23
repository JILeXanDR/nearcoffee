import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Loading } from '~components/Loading';
import { useConfig } from '~config';
import { Profile, useNear } from '~near.adapter';
import { normalizeNearAmount, parseNearAmount, toNearAddress, useQuery } from '~utils';

export const ViewProfile = () => {
    const nearAdapter = useNear();
    const { link } = useParams();
    const { env } = useConfig();
    const query = useQuery();
    const errorCode = query.get('errorCode');
    const isProd = env === 'prod';

    const [profile, setProfile] = useState<Profile>();
    const [loading, setLoading] = useState(true);

    const coffeePrice: number = useMemo(() => profile?.coffee_price ?? 0, [profile]);
    const profileId: string = useMemo(() => toNearAddress(link, isProd), [link]);

    const buyCoffee = async () => {
        try {
            const amount = parseNearAmount(normalizeNearAmount(coffeePrice));
            if (!amount) {
                throw new Error('failed to parse coffee price');
            }
            await nearAdapter.buyOneCoffeeFor(profileId, amount);
        } catch (e) {
            console.error(e);
            // FIXME:
            if (e.toString().includes('Cannot find matching key for transaction sent')) {
                alert('no wallet connected');
            }
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

        nearAdapter.getProfileOf(profileId)
            .then(profile => setProfile(profile))
            .catch(e => alert(e))
            .finally(() => setLoading(false));
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
                <button className="bg-blue-100 hover:bg-blue-200 rounded-md p-2" onClick={buyCoffee}>Buy coffee for {profileId} with coffee price is Ⓝ{normalizeNearAmount(coffeePrice)}</button>
            </div>
        </div>
    );
};
