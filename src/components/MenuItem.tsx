import { Menu } from '@headlessui/react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../utils';

interface Props {
    title: string;
    icon: React.ReactNode;
    handler: string | Function;
}

export const MenuItem = (props: Props) => {
    const { handler, title, icon } = props;
    const attrs = {
        onClick: () => {
        },
        to: '/',
    };

    if (typeof handler === 'function') {
        attrs['onClick'] = handler;
    } else if (typeof handler === 'string') {
        attrs['to'] = handler;
    }

    return (
        <Menu.Item>
            {({ active }) => <Link {...attrs} className={classNames(active ? 'bg-gray-100' : '', 'block px-6 py-4 text-sm text-gray-700')}>
                <div className="flex items-center">
                    {icon}
                    <span className="ml-2">{title}</span>
                </div>
            </Link>}
        </Menu.Item>
    );
};
