import React from 'react'
import SidebarLink from './SidebarLink'

const Sidebar: React.FC = () => {
	return (
		<div className="flex flex-col p-3 text-xl font-bold min-w-48 bg-wax-silver text-wax-gray">
			<SidebarLink to="/dashboard" title="Dashboard" />
			<SidebarLink to="/" title="Shop" />
			<SidebarLink to="/browse" title="Browse" />
			<SidebarLink to="/watchlist" title="Watchlist" />
			{/* <SidebarLink to="#" title="Collection" /> */}
		</div>
	)
}

export default Sidebar
