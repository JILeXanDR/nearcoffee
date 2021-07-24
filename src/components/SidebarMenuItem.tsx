import * as React from 'react';
import { NavLink } from 'react-router-dom';

export interface Props {
    to: string;
    icon: React.ReactNode;
    title: string;
}

export const SidebarMenuItem = (props: Props) => {
    const { to, icon, title } = props;
    return (
        <NavLink exact to={to} className="flex items-center px-4 py-2 font-medium hover:bg-gray-300" activeClassName="bg-gray-100 rounded-sm">
            {icon}<span className="ml-2 text-gray-600">{title}</span>
        </NavLink>
    );
};
