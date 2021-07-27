import { Menu, Transition } from '@headlessui/react';
import { ArrowRightIcon, ChartSquareBarIcon, LogoutIcon, UserCircleIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth.context';
import { MenuItem } from './MenuItem';
import { classNames, removeNearAddressSuffix } from '../utils';

interface Props {
    userImageUrl: string;
}

export const UserIcon = (props: Props) => {
    const { logout, accountId } = useAuth();
    const { userImageUrl } = props;
    return (
        <Menu as="div" className="ml-3 relative">
            {({ open }) => (
                <>
                    <div>
                        <Menu.Button
                            className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none">
                            <span className="sr-only">Open user menu</span><img className="h-8 w-8 rounded-full object-cover cursor-pointer hover:opacity-90" src={userImageUrl} alt="user"/>
                        </Menu.Button>
                    </div>
                    <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items
                            static
                            className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                            <div className="divide-y divide-gray-150">
                                <div className="flex flex-col px-8 py-4">
                                    <div>
                                        <img className="h-10 w-10 rounded-full object-cover" src={userImageUrl} alt="user"/>
                                    </div>
                                    <Menu.Item>
                                        {({ active }) => <Link to={`/${removeNearAddressSuffix(accountId)}`} className={classNames('mt-2', active ? 'text-gray-900' : '', 'text-gray-600')}>
                                            <span className="block font-bold">{accountId}</span>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <span className="mr-1">View my page</span>{<ArrowRightIcon className="flex-shrink-0 h-4 w-4 text-gray-500" aria-hidden="true"/>}
                                            </div>
                                        </Link>}
                                    </Menu.Item>
                                </div>

                                <div>
                                    <MenuItem handler="/user/dashboard" title="Dashboard" icon={<ChartSquareBarIcon className="flex-shrink-0 h-6 w-6 text-gray-500" aria-hidden="true"/>}/>
                                    <MenuItem handler="/user/account" title="My account" icon={<UserCircleIcon className="flex-shrink-0 h-6 w-6 text-gray-500" aria-hidden="true"/>}/>
                                </div>

                                <MenuItem handler={() => logout()} title="Logout" icon={<LogoutIcon className="flex-shrink-0 h-6 w-6 text-gray-500" aria-hidden="true"/>}/>
                            </div>
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
};
