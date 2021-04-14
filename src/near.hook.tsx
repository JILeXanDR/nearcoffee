import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import { useEffect, useState } from 'react';
import { useConfig } from './config';
import { NearAdapter } from './near.adapter';

export const useNear = (): NearAdapter | null => {
    console.log('NearProvider');

    const config = useConfig();
    const [near, setNear] = useState();

    const init = async (): Promise<NearAdapter> => {
        const near = await connect({
            ...config,
            deps: {
                keyStore: new keyStores.BrowserLocalStorageKeyStore(),
            },
        });

        const walletConnection = new WalletConnection(near, '');

        const contract = await new Contract(walletConnection.account(), config.contractName, {
            viewMethods: ['get_profile_of', 'who_bought_coffee_for'],
            changeMethods: ['buy_one_coffee_for'],
        });

        return new NearAdapter(near, walletConnection, contract);
    };

    useEffect(() => {
        init()
            .then((near) => {
                console.log('INIT - OK');
                setNear(near);
            })
            .catch((e) => {
                console.error(`Failed to init NEAR: ${e.toString()}`);
            });
    }, []);

    if (!near) {
        return null;
    }

    return near;
};
