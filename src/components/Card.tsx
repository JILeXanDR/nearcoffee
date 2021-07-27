import * as React from 'react';
import { classNames } from '../utils';

type Props = {
    style?: React.CSSProperties;
    classes?: string[],
    children: React.ReactNode;
}

export const Card = (props: Props) => {
    return (
        <div className={classNames('flex flex-col bg-white p-4 shadow rounded-sm')}>
            {props.children}
        </div>
    );
};
