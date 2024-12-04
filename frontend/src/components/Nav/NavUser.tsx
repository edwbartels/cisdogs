import React from 'react'
import NavUserLink from './NavUserLink'

const NavUser: React.FC = () => {
	return (
		<>
			<div className="flex  pt-3 px-3 text-xl font-bold self-end text-wax-silver">
				<NavUserLink to="/dashboard" title="Dashboard" />
				<div className="self-center">|</div>
				<NavUserLink to="/watchlist" title="Watchlist" />
			</div>
		</>
	)
}

export default NavUser
