import * as React from 'react';
import { classNames } from '~utils';

interface Props {
    children: any;
    bg: string;
    hover: string;
    rounded: boolean | string;
}

export const Button = (props: Props) => {
    return (
        <button
            {...props}
            className={classNames(
                'rounded-lg p-4 text-white font-bold',
                `bg-${props.bg}`,
                `hover:${props.hover}`,
                propValue('rounded', props.rounded),
            )}>
            {props.children}
        </button>
    );
};

// propValue makes css style, ex: rounded, rounded-lg
const propValue = (prop: string, val: boolean | string): string => {
    if (typeof val === 'undefined') {
        return '';
    }
    if (val === true) {
        return prop;
    }
    if (typeof val === 'string') {
        return `name-${val}`;
    }
    return '';
};
