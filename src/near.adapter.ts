import { connect, Contract, keyStores, Near, WalletConnection } from 'near-api-js';
import { Config } from './config';

// blockchain type
export type Profile = {
    // alias for NEAR account id
    account_id: string;
    name: string;
    description: string;
    balance: number;
    cover_image_url: string;
    avatar_image_url: string;
    // amount in yocto nears
    coffee_price: number;
};

export type Supporter = string;

export let instance: NearAdapter;

export class NearAdapter {
    constructor(public near: Near, public walletConnection: WalletConnection, public contract: Contract) {
    }

    async buyOneCoffeeFor(profileId: string, coffeePrice: string): Promise<void> {
        // @ts-ignore
        await this.contract.buy_one_coffee_for({
            account_id: profileId,
        }, 0, coffeePrice);
    }

    async getProfileOf(profileId: string): Promise<Profile> {
        // @ts-ignore
        return await this.contract.get_profile_of({ account_id: profileId });
    }

    async whoBoughtCoffeeFor(profileId: string): Promise<Supporter[]> {
        // @ts-ignore
        return this.contract.who_bought_coffee_for({ account_id: profileId });
    }

    async getAllProfiles(): Promise<Profile[]> {
        // @ts-ignore
        return this.contract.get_all_profiles();
        // return [
        //     {
        //         profile_id: 'jilexandr',
        //         name: 'Robin Wong',
        //         description: 'sharing photography tips, camera reviews on blog & YouTube',
        //         balance: 0,
        //         cover_image_url: 'https://img.buymeacoffee.com/api/?url=aHR0cHM6Ly9jZG4uYnV5bWVhY29mZmVlLmNvbS91cGxvYWRzL3Byb2plY3RfdXBkYXRlcy8yMDIwLzA1L2Q5M2U3MTIwNGJhMzVhMDQ0N2U0YzZlZTMyYjVjMjI4LmpwZw==&size=400',
        //         avatar_image_url: 'https://img.buymeacoffee.com/api/?url=aHR0cHM6Ly9jZG4uYnV5bWVhY29mZmVlLmNvbS91cGxvYWRzL3Byb2ZpbGVfcGljdHVyZXMvMjAyMC8wNC85ZDI1MGFkYWY0ODdhZWI1NTQyMjE5NTIwYjNhYjgwOS5qcGc=&size=300&name=Robin+Wong',
        //         coffee_price: 10 ** 24,
        //     },
        //     {
        //         profile_id: 'test2',
        //         name: 'ChantalTV',
        //         description: 'Livestreaming Every Day in Beautiful Paris',
        //         balance: 0,
        //         cover_image_url: 'https://img.buymeacoffee.com/api/?url=aHR0cHM6Ly9jZG4uYnV5bWVhY29mZmVlLmNvbS91cGxvYWRzL3Byb2plY3RfdXBkYXRlcy8yMDIwLzA1L2Q5M2U3MTIwNGJhMzVhMDQ0N2U0YzZlZTMyYjVjMjI4LmpwZw==&size=400',
        //         avatar_image_url: 'https://img.buymeacoffee.com/api/?url=aHR0cHM6Ly9jZG4uYnV5bWVhY29mZmVlLmNvbS91cGxvYWRzL3Byb2ZpbGVfcGljdHVyZXMvMjAyMC8wNC85ZDI1MGFkYWY0ODdhZWI1NTQyMjE5NTIwYjNhYjgwOS5qcGc=&size=300&name=Robin+Wong',
        //         coffee_price: 2,
        //
        //     },
        //     {
        //         profile_id: 'test3',
        //         name: 'Alastair Johnson',
        //         description: 'resourcing the community of woodworking business owners',
        //         balance: 0,
        //         cover_image_url: 'https://img.buymeacoffee.com/api/?url=aHR0cHM6Ly9jZG4uYnV5bWVhY29mZmVlLmNvbS91cGxvYWRzL3Byb2plY3RfdXBkYXRlcy8yMDIwLzA1L2Q5M2U3MTIwNGJhMzVhMDQ0N2U0YzZlZTMyYjVjMjI4LmpwZw==&size=400',
        //         avatar_image_url: 'https://img.buymeacoffee.com/api/?url=aHR0cHM6Ly9jZG4uYnV5bWVhY29mZmVlLmNvbS91cGxvYWRzL3Byb2ZpbGVfcGljdHVyZXMvMjAyMC8wNC85ZDI1MGFkYWY0ODdhZWI1NTQyMjE5NTIwYjNhYjgwOS5qcGc=&size=300&name=Robin+Wong',
        //         coffee_price: 3,
        //     },
        // ];
    }

    createProfile(accountId: string): Promise<Profile> {
        // @ts-ignore
        return this.contract.create_profile({
            account_id: accountId,
        });
    }
}

export const init = async (config: Config): Promise<NearAdapter> => {
    const near = await connect({
        ...config,
        deps: {
            keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        },
    });

    const walletConnection = new WalletConnection(near, '');

    const contract = await new Contract(walletConnection.account(), config.contractName, {
        viewMethods: ['get_profile_of', 'who_bought_coffee_for', 'get_all_profiles'],
        changeMethods: ['buy_one_coffee_for', 'create_profile'],
    });

    return new NearAdapter(near, walletConnection, contract);
};


export const useNear = (): NearAdapter => {
    if (!instance) {
        throw new Error('NEAR instance adapter is not initialized');
    }
    return instance;
};

