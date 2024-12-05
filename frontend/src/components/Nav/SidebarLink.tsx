import React from 'react'
import { NavLink } from 'react-router-dom'

interface SidebarLinkProps {
	title: string
	to: string
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ title, to }) => {
	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				`text-wax-black p-2 hover:bg-wax-amber rounded-md hover:bg-opacity-70 dark:hover:bg-waxDark-amber dark:hover:bg-opacity-70 ${
					isActive && 'bg-wax-amber'
				}`
			}
		>
			{title}
		</NavLink>
	)
}

export default SidebarLink
