import * as React from 'react';
import { Link } from 'react-router-dom';

const logo = require('/assets/logo.png');

export const Logo = () => {
    return (
        <Link to="/">
            <img className="max-h-16" src={logo} alt="logo"/>
        </Link>
    );
};
