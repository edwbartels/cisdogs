import React, { useState, useEffect } from 'react'
import SessionManagement from './SessionManagement'
import LogoIcon from './LogoIcon'
import { Link, NavLink } from 'react-router-dom'
import CartDropdown from './CartDropdown'
import useAuthStore from '../stores/authStore'

const Navbar: React.FC = () => {
	const cartItems = useAuthStore((state) => state.cart)
	const handleCheckout = useAuthStore((state) => state.checkoutCart)

	return (
		<nav className="bg-wax-black text-wax-silver">
			<div className="px-2 mx-auto m-w-screen-lg sm:px-4 lg:px-6">
				<div className="flex items-center justify-between text-3xl">
					<div className="flex items-center h-16">
						<NavLink className="h-full pr-2" to="/">
							{({ isActive }) => (
								<LogoIcon
									tw="object-contain h-full py-2 cursor-pointer aspect-square"
									isActive={isActive}
								/>
							)}
						</NavLink>
						<NavLink
							className="font-bold pb-1 self-end hover:text-wax-amber"
							to="/"
						>
							Wax Exchange
						</NavLink>
					</div>
					<div className="flex pb-1 text-lg self-end hidden space-x-4 md:flex hover:text-wax-amber">
						<Link to="submissions">Submissions</Link>
					</div>
					<div className="flex">
						<div className="flex items-center">
							<SessionManagement />
						</div>
						<CartDropdown cartItems={cartItems} onCheckout={handleCheckout} />
					</div>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
