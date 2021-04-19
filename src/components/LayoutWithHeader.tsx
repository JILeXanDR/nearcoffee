import { Disclosure, Menu, Transition } from '@headlessui/react';
import * as React from 'react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '~components/Logo';
import { classNames } from '~utils';

export const LayoutWithHeader = (props) => {
    return (
        <div>
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between h-16">

                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Logo/>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-10 flex items-baseline space-x-4">
                                            <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden md:block">
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
                                                                    <Link to={1} className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>Profile</Link>
                                                                )}
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <a className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')} onClick={() => {
                                                                    }}>Logout</a>
                                                                )}
                                                            </Menu.Item>
                                                        </Menu.Items>
                                                    </Transition>
                                                </>
                                            )}
                                        </Menu>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </>
                )}
            </Disclosure>

            <main>
                <div className="container mx-auto">
                    {props.children}
                </div>
            </main>
        </div>
    );

    // return (
    //     <div className="mx-auto">
    //         <Header logo={<Logo/>} actions={<ConnectOrDashboard/>}/>
    //
    //         <div className="container mx-auto">
    //             {props.children}
    //         </div>
    //     </div>
    // );
};
