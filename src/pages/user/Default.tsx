import { HeartIcon, LockOpenIcon, PresentationChartBarIcon, UserGroupIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth.context';
import { Card } from '../../components/Card';
import { Profile, useNear } from '../../near.adapter';

export const DefaultTab = () => {
    const near = useNear();
    const { accountId } = useAuth();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile>();

    const withdraw = () => {
    };

    const createProfile = async () => {
        try {
            const profile = await near.createProfile(accountId);
            alert(JSON.stringify(profile));
        } catch (e) {
            alert(e.toString());
        }
    };

    useEffect(() => {
        near.getProfileOf(accountId)
            .then(profile => setProfile(profile))
            .catch(e => {
                alert(e.toString());
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <h1>loading...</h1>;
    }

    if (!profile) {
        return (
            <Card>
                <div className="text-lg">
                    <p>You don't have own profile yet.</p>
                    <p>But you can still be supporter.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 focus:outline-none rounded-full p-2 text-white font-medium" onClick={() => createProfile()}>Create profile</button>
            </Card>
        );
    }

    return (
        <>
            <StatsCard
                followers={0}
                supporters={0}
                members={0}
            />

            <button className="bg-blue-100" onClick={withdraw}>Withdraw</button>
        </>
    );
};

interface StatsCardProps {
    followers: number;
    supporters: number;
    members: number;
}

const StatsCard = (props: StatsCardProps) => {
    const { followers, supporters, members } = props;
    return (
        <Card>
            <div className="flex flex-row p-4 justify-between">
                <div className="uppercase text-normal font-medium text-gray-600">Overview</div>
                <div>
                    <Link to="/user/stats" className="bg-gray-200 hover:bg-gray-300 focus:outline-none rounded-full text-gray-800 px-4 py-2 text-sm flex items-center">
                        <PresentationChartBarIcon className="flex-shrink-0 h-5 w-5 text-gray-500 mr-2" aria-hidden="true"/>
                        View all stats
                    </Link>
                </div>
            </div>
            <div className="flex flex-row justify-between divide-x divide-gray-150">
                <StatsCardItem
                    title={
                        <>
                            <UserGroupIcon className="flex-shrink-0 h-5 w-5 text-gray-500 mr-2" aria-hidden="true"/>
                            <span className="text-sm">Followers</span>
                        </>
                    }
                    value={followers}
                />
                <StatsCardItem
                    title={
                        <>
                            <HeartIcon className="flex-shrink-0 h-5 w-5 text-gray-500 mr-2" aria-hidden="true"/>
                            <span className="text-sm">Supporters</span>
                        </>
                    }
                    value={supporters}
                />
                <StatsCardItem
                    title={
                        <>
                            <LockOpenIcon className="flex-shrink-0 h-5 w-5 text-gray-500 mr-2" aria-hidden="true"/>
                            <span className="text-sm">Members</span>
                        </>
                    }
                    value={members}
                />
            </div>
        </Card>
    );
};

interface StatsCardItemProps {
    title: React.ReactNode;
    value: number;
}

const StatsCardItem = (props: StatsCardItemProps) => {
    const { title, value } = props;
    return (
        <div className="flex flex-col px-4 py-3">
            <div className="flex items-center mb-2">{title}</div>
            <div className="font-medium text-3xl">{value}</div>
        </div>
    );
};
