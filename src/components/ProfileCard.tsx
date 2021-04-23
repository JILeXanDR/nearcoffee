import * as React from 'react';
import { Profile } from '~near.adapter';
import { classNames } from '~utils';

interface Props extends Profile {
    onClick: Function;
    className: string;
}

export const ProfileCard = (props: Props) => {
    return (
        <figure onClick={props.onClick} className={classNames(props.className, 'flex flex-col bg-gray-100 rounded-xl p-8 md:p-0 cursor-pointer')}>
            <img className="md:h-auto mx-auto" src={props.cover_image_url} alt="" width="384" height="512"/>
            <div className="pt-6 md:p-8 text-center md:text-left space-y-4">
                <blockquote>
                    <p className="text-lg font-semibold text-center">
                        <span>{props.name}</span> <span className="text-gray-500">is {props.description}</span>
                    </p>
                </blockquote>
            </div>
        </figure>
    );
};
