import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { Fragment } from 'react';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { useAuth } from '~auth.context';
import { Dashboard } from '~pages/Dashboard';
import { classNames } from '~utils';

export const Layout = (props) => {
    const { match } = props;
    const { isSignedIn, accountId, login, logout } = useAuth();

    return (
        <div>
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between h-16">

                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img className="h-12 w-12" src="https://cdn2.iconfinder.com/data/icons/miscellaneous-5/512/coffee-512.png" alt="Coffee"/>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-10 flex items-baseline space-x-4">
                                            <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                                            {isSignedIn && <Link to="/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>}
                                        </div>
                                    </div>
                                </div>

                                {isSignedIn && <div className="hidden md:block">
                                    <div className="ml-4 flex items-center md:ml-6">
                                        {/* Profile dropdown */}
                                        <Menu as="div" className="ml-3 relative">
                                            {({ open }) => (
                                                <>
                                                    <div>
                                                        <Menu.Button
                                                            className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                                            <span className="sr-only">Open user menu</span>
                                                            <img className="h-8 w-8 rounded-full" src="https://isthiscoinascam.com/logo/n/near-protocol-128x076299b336f035d5a21f12bea6ef5568.png"
                                                                 alt=""/>
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
                                                            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                                        >
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <Link to={accountId} className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>Profile</Link>
                                                                )}
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <a className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')} onClick={logout}>Logout</a>
                                                                )}
                                                            </Menu.Item>
                                                        </Menu.Items>
                                                    </Transition>
                                                </>
                                            )}
                                        </Menu>
                                    </div>
                                </div>}

                                <div className="-mr-2 flex md:hidden">
                                    {/* Mobile menu button */}
                                    <Disclosure.Button
                                        className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? <XIcon className="block h-6 w-6" aria-hidden="true"/> : <MenuIcon className="block h-6 w-6" aria-hidden="true"/>}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="md:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
                                {isSignedIn && <Link to="/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>}
                            </div>

                            {/*{ Mobile }*/}
                            {isSignedIn && <div className="pt-4 pb-3 border-t border-gray-700">
                                <div className="flex items-center px-5">
                                    <div className="flex-shrink-0">
                                        <img className="h-10 w-10 rounded-full"
                                             src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                             alt=""/>
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium leading-none text-white">{accountId}</div>
                                        <div className="text-sm font-medium leading-none text-gray-400">todo</div>
                                    </div>
                                </div>
                                <div className="mt-3 px-2 space-y-1">
                                    <Link to={accountId} className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">Profile</Link>
                                    <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700" onClick={logout}>Logout</Link>
                                </div>
                            </div>}
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>

            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                </div>
            </header>

            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <Switch>
                        <Route exact path={`${match.path}`} render={(props) => <Dashboard {...props} />}/>
                    </Switch>
                </div>
            </main>
        </div>
    );
};
