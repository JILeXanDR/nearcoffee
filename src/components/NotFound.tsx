import * as React from 'react';
import { Header } from '~components/Header';
import { Logo } from '~components/Logo';
import { ConnectOrDashboard } from '~components/ConnectOrDashboard';

interface Props {
    message: string;
}

export const NotFound = (props: Props) => {
    return (
        <div className="flex flex-col h-full">
            <Header logo={<Logo/>} actions={<ConnectOrDashboard/>}/>
            <div className="container mx-auto h-full">
                <h1>{props.message}</h1>
            </div>
        </div>
    );
};
