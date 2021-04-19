import * as React from 'react';

interface Props {
    logo: React.ReactNode;
    actions: React.ReactNode;
}

export const Header = (props: Props) => {
    return (
        <div className="flex flex-row justify-between items-center md:px-12 md:py-6 p-2">
            <div>{props.logo}</div>
            <div>{props.actions}</div>
        </div>
    );
};
