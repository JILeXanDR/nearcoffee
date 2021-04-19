import * as React from 'react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { ProfileCard } from '~components/ProfileCard';
import { Profile, useNear } from '~near.adapter';

export const Home = () => {
    const near = useNear();
    const history = useHistory();

    const [profiles, setProfiles] = useState<Profile[]>([] as Profile[]);

    useEffect(() => {
        near.getAllProfiles()
            .then(list => setProfiles(list))
            .catch(e => console.error(e));
    }, []);

    const goProfile = (profile: Profile) => {
        const strings = profile.profile_id.split('.');
        const link = strings.splice(0, strings.length).join('.');
        history.push(`/${link}`);
    };

    return (
        <>
            <div className="w-full p-4">
                <div className="flex">
                    <div className="rounded-md border-dotted shadow-lg bg-clip-border border-dashed p-4 m-4 bg-gradient-to-r from-yellow-200 to-orange-300">
                        <p className="text-justify break-words leading-relaxed font-medium">NEAR.Coffee is a simple, meaningful way to fund your creative work with Ⓝ.</p>
                        <p className="break-words leading-relaxed font-medium">Without stitching together a bunch of apps like Patreon, Mailchimp, and a donate button — you can accept support,
                            memberships, and build a direct
                            relationship with your fans.</p>
                        <p className="break-words leading-relaxed font-medium">Your fans are going to love it.</p>
                    </div>
                    <div className="ml-4">
                        <img src="https://near.org/wp-content/uploads/2019/09/nearkat-ambassador.png" alt=""/>
                    </div>
                </div>
            </div>

            <div>
                <h1>Explore profiles</h1>
                <div className="flex">
                    {profiles.map(profile => {
                        return (
                            <ProfileCard className="m-2" onClick={() => goProfile(profile)} key={profile.profile_id} {...profile}/>
                        );
                    })}
                </div>
            </div>
        </>
    );
};
