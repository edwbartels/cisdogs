import React from 'react'
import SessionManagement from './SessionManagement'
import LogoIcon from '../Icons/LogoIcon'
import { NavLink } from 'react-router-dom'
import CartDropdown from './CartDropdown'
import useAuthStore from '../../stores/authStore'
import QuickCreate from './QuickCreate'
import NavUser from './NavUser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { faMoon as faMoonOpen } from '@fortawesome/free-regular-svg-icons'

const Navbar: React.FC = () => {
	const { isDarkMode, toggleDarkMode } = useAuthStore((state) => state)
	const cartItems = useAuthStore((state) => state.cart)
	const handleCheckout = useAuthStore((state) => state.checkoutCart)

	return (
		<nav className="px-1 w-full m-w-screen-lg sm:px-4 lg:px-6">
			<div className="flex items-center justify-between text-3xl">
				<div className="flex items-end h-16">
					<NavLink className="h-full pr-2" to="/">
						{({ isActive }) => (
							<LogoIcon
								tw="object-contain h-full py-2 cursor-pointer aspect-square"
								isActive={isActive}
							/>
						)}
					</NavLink>
					<NavLink
						className="font-bold  hover:text-wax-amber dark:hover:text-waxDark-amber"
						to="/"
					>
						Wax Exchange
					</NavLink>
				</div>
				<NavUser />
				<QuickCreate />
				{/* <div className="flex-col items-center justify-between hidden md:flex">
						<div className="font-bold text-xl border-b-2 border-wax-silver w-full text-center px-4">
							Add a...
						</div>
						<div className="flex space-x-2 text-base self-center ">
							<div className="flex hover:text-wax-amber self-end">
								<Link to="#">Listing</Link>
							</div>
							<a className="text-xl">|</a>
							<div className="flex hover:text-wax-amber self-end">
								<Link to="submissions">Release</Link>
							</div>
						</div>
					</div> */}
				<div className="flex space-x-2 items-center">
					<div className="flex items-center">
						<SessionManagement />
					</div>

					<CartDropdown cartItems={cartItems} onCheckout={handleCheckout} />

					<FontAwesomeIcon
						icon={isDarkMode ? faSun : faMoon}
						onClick={toggleDarkMode}
						className="pl-2 cursor-pointer hover:text-wax-amber dark:hover:text-waxDark-amber"
					/>
				</div>
			</div>
			{/* </div> */}
		</nav>
	)
}

export default Navbar
