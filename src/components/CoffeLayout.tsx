import { Menu, Transition } from '@headlessui/react';
import { ArrowRightIcon, ChartSquareBarIcon, LoginIcon, LogoutIcon, UserCircleIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '~auth.context';
import { classNames, removeNearAddressSuffix } from '~utils';

const userImage = 'https://img.buymeacoffee.com/api/?url=aHR0cHM6Ly9jZG4uYnV5bWVhY29mZmVlLmNvbS91cGxvYWRzL3Byb2ZpbGVfcGljdHVyZXMvMjAyMS8wNC8wNWFmNDdlYjViMjhhYzRhNmVhYjdmODEyYTJjOWMwMy5wbmc=&size=300&name=Alexandr+Shtovba';

const Header = () => {
    const { isSignedIn, login } = useAuth();
    return (
        <div className="flex flex-row justify-between items-center px-8 py-4">
            <div>
                <Link to="/">
                    <img src={require('~assets/logo.svg')} alt="logo"/>
                </Link>
            </div>
            <div>
                {isSignedIn && <UserIcon icon={<img className="h-10 w-10 rounded-full object-cover cursor-pointer hover:opacity-90" src={userImage} alt="user"/>}/>}
                {!isSignedIn && <button type="button" className="inline-flex items-center p-4 bg-blue-600 rounded-md text-gray-100 font-bold hover:bg-blue-700" onClick={() => login()}>
                    <LoginIcon className="flex-shrink-0 h-6 w-6 text-gray-100 mr-1" aria-hidden="true"/>
                    Connect NEAR wallet
                </button>}
            </div>
        </div>
    );
};

interface MenuItemProps {
    title: string;
    icon: React.ReactNode;
    handler: string | Function;
}

const MenuItem = (props: MenuItemProps) => {
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

interface UserIconProps {
    icon: React.ReactNode;
}

const UserIcon = (props: UserIconProps) => {
    const { logout, accountId } = useAuth();
    const { icon } = props;
    return (
        <Menu as="div" className="ml-3 relative">
            {({ open }) => (
                <>
                    <div>
                        <Menu.Button
                            className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none">
                            <span className="sr-only">Open user menu</span>{icon}
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
                                        <img className="h-10 w-10 rounded-full object-cover" src={userImage} alt="user"/>
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
                                    <MenuItem handler="/dashboard" title="Dashboard" icon={<ChartSquareBarIcon className="flex-shrink-0 h-6 w-6 text-gray-500" aria-hidden="true"/>}/>
                                    <MenuItem handler="/account" title="My account" icon={<UserCircleIcon className="flex-shrink-0 h-6 w-6 text-gray-500" aria-hidden="true"/>}/>
                                </div>

                                <div>
                                    <MenuItem handler={() => logout()} title="Logout" icon={<LogoutIcon className="flex-shrink-0 h-6 w-6 text-gray-500" aria-hidden="true"/>}/>
                                </div>
                            </div>
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
};

interface Props {
    children: React.ReactNode;
}

export const CoffeeLayout = (props: Props) => {
    return (
        <div>
            <Header/>
            <div className="container mx-auto">
                {props.children}
            </div>
        </div>
    );
};
