import React from 'react';
import SidebarLink from './SidebarLink';

const Sidebar: React.FC = () => {
	return (
		<div className="flex flex-col w-32 h-screen bg-wax-silver text-wax-gray font-bold">
			<SidebarLink title="Dashboard" />
			<SidebarLink title="Collection" />
			<SidebarLink title="Listings" />
			<SidebarLink title="Watchlist" />
			<SidebarLink title="Browse" />
		</div>
	);
};

export default Sidebar;
