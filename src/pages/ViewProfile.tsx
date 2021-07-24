import { ShareIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useAuth } from '~auth.context';
import { Card } from '~components/Card';
import { Loading } from '~components/Loading';
import { useConfig } from '~config';
import { Profile, useNear } from '~near.adapter';
import { coverImage, userImage } from '~static';
import { classNames, normalizeNearAmount, parseNearAmount, removeNearAddressSuffix, toNearAddress, useQuery } from '~utils';

export const ViewProfile = () => {
    const { isSignedIn, accountId } = useAuth();
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
    const isAccountOwner: boolean = useMemo(() => accountId === profileId, [accountId, profileId]);
    const buyingDisabled: boolean = useMemo(() => !isSignedIn, [isSignedIn]);

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

    const showShareLink = () => {
        prompt('', `${window.location.origin}/${removeNearAddressSuffix(profileId)}`);
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
        <>
            <img src={coverImage} alt="cover"/>
            <div className="flex items-center justify-between bg-white p-6">
                <div className="flex items-center">
                    <Link to={removeNearAddressSuffix(profileId)}>
                        <img className="h-24 w-24 rounded-full object-cover border-4 border-indigo-200" src={userImage} alt="user"/>
                    </Link>
                    <div className="text-xl ml-4">
                        <span className="font-bold">{profileId}</span>
                        <span> is {profile.description}</span>
                    </div>
                </div>
                <div className="flex">
                    {isAccountOwner &&
                    <button className="flex bg-blue-500 hover:bg-blue-600 focus:outline-none px-6 py-2 items-center rounded-full font-semibold text-sm text-white">Edit profile</button>}
                    <button onClick={() => showShareLink()} className="flex bg-gray-200 hover:bg-gray-300 focus:outline-none px-4 py-2 items-center rounded-full font-semibold text-sm">
                        Share
                        <ShareIcon className="flex-shrink-0 h-5 w-5 text-gray-500 ml-1" aria-hidden="true"/>
                    </button>
                </div>
            </div>

            <div className="container mx-auto mt-10 flex justify-center">
                <Card classes={['w-1/2']}>
                    <div className="flex flex-col">
                        <div className="text-2xl font-medium text-center mb-2">
                            <span>Buy </span>
                            <span className="text-gray-600 font-semibold">{profileId}</span>
                            <span> a coffee</span>
                        </div>
                        <div className="mb-2">
                            <textarea className="w-full resize-none border border-gray-300 bg-gray-100 rounded-md p-2" placeholder="Say something nice.. (optional)" maxLength={30}></textarea>
                        </div>

                        <button
                            onClick={() => buyCoffee()}
                            className={classNames(
                                'rounded-lg p-4 text-white font-bold rounded',
                                buyingDisabled ? 'bg-gray-600' : 'bg-blue-600',
                                buyingDisabled ? 'cursor-not-allowed' : 'hover:bg-blue-700',
                            )}
                            disabled={buyingDisabled}
                            title={buyingDisabled ? 'To continue connect your NEAR wallet' : ''}
                        >
                            Support Ⓝ{normalizeNearAmount(coffeePrice)}
                        </button>

                    </div>
                </Card>
            </div>
        </>
    );
};
