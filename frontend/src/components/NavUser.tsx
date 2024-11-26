import React, { useState } from 'react'
import NavUserLink from './NavUserLink'
import SignInModal from './SignInModal'

const NavUser: React.FC = () => {
	return (
		<>
			<div className="flex  p-3 text-xl font-bold  text-wax-silver">
				<NavUserLink to="/dashboard" title="Dashboard" />
				<NavUserLink to="/watchlist" title="Watchlist" />
			</div>
		</>
	)
}

export default NavUser
