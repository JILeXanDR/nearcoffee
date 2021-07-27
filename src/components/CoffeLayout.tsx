import * as React from 'react';
import { Header } from './Header';

interface Props {
    children: React.ReactNode;
}

export const CoffeeLayout = (props: Props) => {
    return (
        <>
            <Header/>
            <div>
                {props.children}
            </div>
        </>
    );
};
