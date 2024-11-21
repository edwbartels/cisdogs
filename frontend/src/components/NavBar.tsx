import React from 'react'
import SessionManagement from './SessionManagement'
import LogoIcon from './LogoIcon'
import { Link, NavLink } from 'react-router-dom'

const Navbar: React.FC = () => {
	return (
		<nav className="bg-wax-black text-wax-silver">
			<div className="px-4 mx-auto m-w-screen-lg sm:px-6 lg:px-8">
				<div className="flex items-center justify-between text-3xl">
					<div className="flex items-center h-24">
						<NavLink className="h-full pr-2" to="/">
							{({ isActive }) => (
								<LogoIcon
									tw="object-contain h-full py-2 cursor-pointer aspect-square"
									isActive={isActive}
								/>
							)}
						</NavLink>
						<NavLink className="font-bold hover:text-wax-amber" to="/">
							Wax Exchange
						</NavLink>
					</div>
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
					<div className="flex items-center">
						<Link to="submissions" className="pr-8">
							Submissions
						</Link>
						<SessionManagement />
					</div>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
