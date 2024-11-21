import React from 'react'
import SidebarLink from './SidebarLink'

const Sidebar: React.FC = () => {
	return (
		<div className="flex flex-col p-3 text-xl font-bold min-w-48 bg-wax-silver text-wax-gray">
			<SidebarLink to="dashboard" title="Dashboard" />
			<SidebarLink to="#" title="Collection" />
			<SidebarLink to={'listings'} title="Listings" />
			<SidebarLink to="#" title="Watchlist" />
			<SidebarLink to="#" title="Browse" />
		</div>
	)
}

export default Sidebar
