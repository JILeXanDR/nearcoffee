import * as nearAPI from 'near-api-js';
import { useLocation } from 'react-router';

export function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ');
}

export function useQuery(): URLSearchParams {
    return new URLSearchParams(useLocation().search);
}

// toNearAddress merges "name" with suffix "near|testnet" according to current env.
export function toNearAddress(name: string, isProd: boolean): string {
    return [name, isProd ? 'near' : 'testnet'].join('.');
}

// removeNearAddressSuffix converts NEAR address like "name.near" into "name".
export function removeNearAddressSuffix(address: string): string {
    const strings = address.split('.');
    if (strings.length === 1) {
        return address;
    }
    return strings.splice(0, strings.length - 1).join('.');
}

export function parseNearAmount(amount: number): string | null {
    return nearAPI.utils.format.parseNearAmount(amount.toString());
}

// normalizeNearAmount converts amount in yocto nears into nears.
export function normalizeNearAmount(amount: number): number {
    return amount / 10 ** 24;
}
