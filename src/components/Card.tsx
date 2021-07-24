import * as React from 'react';
import { classNames } from '~utils';

interface Props {
    classes: string[],
}

export const Card = (props: Props) => {
    return (
        <div {...props} className={classNames('flex flex-col bg-white p-4 shadow rounded-sm', ...props.classes)}>
            {props.children}
        </div>
    );
};
