import React from 'react'
import SessionManagement from './SessionManagement'
import LogoIcon from './LogoIcon'
import { NavLink } from 'react-router-dom'

const Navbar: React.FC = () => {
	return (
		<nav className="bg-wax-black text-wax-silver">
			<div className="px-4 mx-auto m-w-screen-lg sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-24 text-3xl">
					<NavLink className="h-full" to="/">
						{({ isActive }) => (
							<LogoIcon
								tw="object-contain h-full py-2 cursor-pointer aspect-square"
								isActive={isActive}
							/>
						)}
					</NavLink>
					{/* <div className="flex-shrink-0">
						<a href="/" className="text-4xl font-bold">
							MyLogo
						</a>
					</div> */}

					{/* Navigation Links */}
					{/* <div className="hidden space-x-4 md:flex">
						<a
							href="#"
							className="px-3 py-2 rounded-md hover:bg-wax-amber hover:text-wax-black"
						>
							Home
						</a>
						<a
							href="#"
							className="px-3 py-2 rounded-md hover:bg-wax-amber hover:text-wax-black"
						>
							About
						</a>
						<a
							href="#"
							className="px-3 py-2 rounded-md hover:bg-wax-amber hover:text-wax-black"
						>
							Services
						</a>
						<a
							href="#"
							className="px-3 py-2 rounded-md hover:bg-wax-amber hover:text-wax-black"
						>
							Contact
						</a>
					</div> */}

					<SessionManagement />
				</div>
			</div>
		</nav>
	)
}

export default Navbar
