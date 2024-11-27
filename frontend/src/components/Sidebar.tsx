import React from 'react'
import SidebarLink from './SidebarLink'

const Sidebar: React.FC = () => {
	return (
		<div className="flex flex-col text-xl font-bold min-w-40 bg-wax-silver text-wax-gray">
			{/* <SidebarLink to="/dashboard" title="Dashboard" /> */}
			<SidebarLink to="/" title="Shop" />
			<div className="text-wax-black px-2 pt-4 pb-2 border-b-2 border-b-wax-black rounded-b-lg border-t-2 border-t-wax-cream">
				Browse by..
			</div>
			{/* <SidebarLink to="/browse" title="Browse" /> */}
			<div className=" flex flex-col shadow-md rounded-lg text-lg">
				<SidebarLink to="/releases" title="Releases" />
				<SidebarLink to="/albums" title="Albums" />
				<SidebarLink to="/artists" title="Artists" />
				<SidebarLink to="/browse" title="All" />
			</div>
			<div className="text-wax-black px-2 pt-4 pb-2 border-b-2 border-b-wax-black rounded-b-lg border-t-2 border-t-wax-cream">
				Filter
			</div>
			<small className="ml-2">coming soon...</small>

			{/* <SidebarLink to="/watchlist" title="Watchlist" /> */}
			{/* <SidebarLink to="#" title="Collection" /> */}
		</div>
	)
}

export default Sidebar
