import { ChartSquareBarIcon, CogIcon, UserGroupIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { useAuth } from '../../auth.context';
import { SidebarMenuItem } from '../../components/SidebarMenuItem';
import { DefaultTab } from './Default';
import { SettingsTab } from './Settings';
import { SupportersTab } from './Supporters';
import { userImage } from '../../static';

// TODO: only for users with connected wallet (is_signed = true)
export const Index = () => {
    const { url } = useRouteMatch();
    const { accountId } = useAuth();
    return (
        <div className="container mx-auto flex justify-between">
            <div className="flex flex-col">
                <div className="flex flex-col items-center justify-center mb-4">
                    <img className="h-16 w-16 rounded-full object-cover" src={userImage} alt="user"/>
                    <div className="font-semibold m-2">{accountId}</div>
                </div>
                <div className="bg-gray-200 hidden md:block mr-4">
                    <SidebarMenuItem to={`${url}/dashboard`} title="Dashboard" icon={<ChartSquareBarIcon className="flex-shrink-0 h-6 w-6 text-gray-500" aria-hidden="true"/>}/>
                    <SidebarMenuItem to={`${url}/supporters`} title="Supporters" icon={<UserGroupIcon className="flex-shrink-0 h-6 w-6 text-gray-500" aria-hidden="true"/>}/>
                    <SidebarMenuItem to={`${url}/settings`} title="Settings" icon={<CogIcon className="flex-shrink-0 h-6 w-6 text-gray-500" aria-hidden="true"/>}/>
                </div>
            </div>
            <div className="flex-grow">
                <Switch>
                    <Route exact path={`${url}/dashboard`} render={(props) => <DefaultTab/>}/>
                    <Route path={`${url}/supporters`} render={(props) => <SupportersTab/>}/>
                    <Route path={`${url}/settings`} render={(props) => <SettingsTab/>}/>
                    <Route path="*" render={(props) => <h1>Not found</h1>}/>
                </Switch>
            </div>
        </div>
    );
};
