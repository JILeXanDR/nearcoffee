import { LoginIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '~auth.context';
import { UserIcon } from '~components/UserIcon';
import { userImage } from '~static';

const logo = require('~assets/logo.svg');

export const Header = () => {
    const { isSignedIn, login } = useAuth();
    return (
        <div className="flex flex-row justify-between items-center px-8 py-4 mb-3">
            <div>
                <Link to="/">
                    <img src={logo} alt="logo"/>
                </Link>
            </div>
            <div>
                {isSignedIn && <UserIcon userImageUrl={userImage}/>}
                {!isSignedIn && <button type="button" className="inline-flex items-center p-4 bg-blue-600 rounded-md text-gray-100 font-bold hover:bg-blue-700" onClick={() => login()}>
                    <LoginIcon className="flex-shrink-0 h-6 w-6 text-gray-100 mr-1" aria-hidden="true"/>
                    Connect NEAR wallet
                </button>}
            </div>
        </div>
    );
};
