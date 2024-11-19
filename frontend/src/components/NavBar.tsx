import React from 'react';
import SessionManagement from './SessionManagement';

const Navbar: React.FC = () => {
	return (
		<nav className="bg-wax-black text-wax-silver">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div className="flex-shrink-0">
						<a href="/" className="text-xl font-bold">
							MyLogo
						</a>
					</div>

					{/* Navigation Links */}
					<div className="hidden md:flex space-x-4">
						<a
							href="#"
							className="hover:bg-wax-amber hover:text-wax-black px-3 py-2 rounded-md"
						>
							Home
						</a>
						<a
							href="#"
							className="hover:bg-wax-amber hover:text-wax-black px-3 py-2 rounded-md"
						>
							About
						</a>
						<a
							href="#"
							className="hover:bg-wax-amber hover:text-wax-black px-3 py-2 rounded-md"
						>
							Services
						</a>
						<a
							href="#"
							className="hover:bg-wax-amber hover:text-wax-black px-3 py-2 rounded-md"
						>
							Contact
						</a>
					</div>

					<SessionManagement />
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
