import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarLinkProps {
	title: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ title }) => {
	return (
		<NavLink to="#" className="text-wax-black p-2 hover:bg-wax-amber">
			{title}
		</NavLink>
	);
};

export default SidebarLink;
