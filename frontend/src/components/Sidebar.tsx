import React from 'react'
import SidebarLink from './SidebarLink'

const Sidebar: React.FC = () => {
	return (
		<div className="flex flex-col w-32 h-screen font-bold bg-wax-silver text-wax-gray">
			<SidebarLink to="dashboard" title="Dashboard" />
			<SidebarLink to="#" title="Collection" />
			<SidebarLink to={'listings'} title="Listings" />
			<SidebarLink to="#" title="Watchlist" />
			<SidebarLink to="#" title="Browse" />
		</div>
	)
}

export default Sidebar
