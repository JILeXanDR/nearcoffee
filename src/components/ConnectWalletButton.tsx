import * as React from 'react';

export const ConnectWalletButton = (props) => {
    return (
        <button
            {...props}
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-800 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            Connect to Wallet
        </button>
    );
};
