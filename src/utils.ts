import { useLocation } from 'react-router';

export function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export function useQuery() {
    return new URLSearchParams(useLocation().search);
}
