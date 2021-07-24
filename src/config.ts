// env given from parcel
export type GlobalEnv = {
    NODE_ENV: string,
    CONTRACT_NAME: string,
};

// config passed into near-js library
export type NearConfig = {
    networkId: string;
    nodeUrl: string;
    walletUrl?: string;
    helperUrl?: string;
    explorerUrl?: string;
};

// final app config
export type Config = NearConfig & {
    env: string;
    contractName: string,
};

export const getConfig = (env: GlobalEnv): Config => {
    switch (env.NODE_ENV) {
        case 'prod':
        case 'production':
            return {
                env: 'prod',
                networkId: 'mainnet',
                nodeUrl: 'https://rpc.mainnet.near.org',
                walletUrl: 'https://wallet.near.org',
                helperUrl: 'https://helper.mainnet.near.org',
                explorerUrl: 'https://explorer.mainnet.near.org',
                contractName: env.CONTRACT_NAME,
            };
        case 'dev':
        case 'development':
            return {
                env: 'dev',
                networkId: 'testnet',
                nodeUrl: 'https://rpc.testnet.near.org',
                walletUrl: 'https://wallet.testnet.near.org',
                helperUrl: 'https://helper.testnet.near.org',
                explorerUrl: 'https://explorer.testnet.near.org',
                contractName: env.CONTRACT_NAME,
            };
        default:
            throw Error(`Unconfigured environment '${env.NODE_ENV}'.`);
    }
};

let config: Config;

export const useConfig = (): Config => {
    if (!config) {
        config = getConfig({
            NODE_ENV: process.env.NODE_ENV ?? '',
            CONTRACT_NAME: process.env.CONTRACT_NAME ?? '',
        });
    }
    return config;
};
