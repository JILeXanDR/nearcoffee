import { Contract, Near, WalletConnection } from 'near-api-js';

export type Profile = {
    profile_id: string;
    description: string;
    balance: number;
};

export type Supporter = string;

export class NearAdapter {
    constructor(public near: Near, public walletConnection: WalletConnection, public contract: Contract) {
    }

    async login(): Promise<void> {
        await this.walletConnection.requestSignIn('', '', '', '');
    }

    async logout(): Promise<void> {
        await this.walletConnection.signOut();
    }

    isLogged(): boolean {
        return this.walletConnection.isSignedIn();
    }

    async buyCoffee(profileId: string, coffeePrice: string): Promise<void> {
        await this.contract.buy_one_coffee_for({
            account_id: profileId,
        }, 0, coffeePrice);
    }

    async getProfile(profileId: string): Promise<Profile> {
        return await this.contract.get_profile_of({ account_id: profileId });
    }

    async getSupporters(profileId: string): Promise<Supporter[]> {
        return this.contract.who_bought_coffee_for({ account_id: profileId });
    }
}
