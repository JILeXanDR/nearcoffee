import { ChartSquareBarIcon, CogIcon, UserGroupIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { NavLink } from 'react-router-dom';
import { DefaultTab } from '~pages/dashboard/Default';
import { SettingsTab } from '~pages/dashboard/Settings';
import { SupportersTab } from '~pages/dashboard/Supporters';

interface SidebarMenuItemProps {
    to: string;
    icon: React.ReactNode;
    title: string;
}

const SidebarMenuItem = (props: SidebarMenuItemProps) => {
    const { to, icon, title } = props;
    return (
        <NavLink exact to={to} className="flex items-center px-4 py-2 font-medium" activeClassName="bg-gray-100 rounded-sm">
            {icon}<span className="ml-2 text-gray-600 hover:text-gray-700">{title}</span>
        </NavLink>
    );
};

// TODO: only for users with connected wallet (is_signed = true)
export const Index = () => {
    const { url } = useRouteMatch();
    return (
        <div className="flex flex-row justify-between p-2 bg-blue-100">
            <div className="bg-red-100 hidden md:block mr-4">
                <SidebarMenuItem to={`${url}`} title="Dashboard" icon={<ChartSquareBarIcon className="flex-shrink-0 h-6 w-6 text-gray-500" aria-hidden="true"/>}/>
                <SidebarMenuItem to={`${url}/supporters`} title="Supporters" icon={<UserGroupIcon className="flex-shrink-0 h-6 w-6 text-gray-500" aria-hidden="true"/>}/>
                <SidebarMenuItem to={`${url}/settings`} title="Settings" icon={<CogIcon className="flex-shrink-0 h-6 w-6 text-gray-500" aria-hidden="true"/>}/>
            </div>
            <div className="bg-yellow-100 flex-grow p-2">
                <Switch>
                    <Route exact path={`${url}`} render={(props) => <DefaultTab/>}/>
                    <Route path={`${url}/supporters`} render={(props) => <SupportersTab/>}/>
                    <Route path={`${url}/settings`} render={(props) => <SettingsTab/>}/>
                    <Route path="*" render={(props) => <h1>Not found</h1>}/>
                </Switch>
            </div>
        </div>
    );
};
