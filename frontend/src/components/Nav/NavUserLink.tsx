import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'
import useModalStore from '../../stores/modalStore'
import { NavLink } from 'react-router-dom'

interface NavUserLinkProps {
	title: string
	to: string
}

const NavUserLink: React.FC<NavUserLinkProps> = ({ title, to }) => {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
	const navigate = useNavigate()
	const { setActiveModal, next, setNext } = useModalStore((state) => state)
	useEffect(() => {
		if (next) {
			navigate(next)
		}
		return () => {
			setNext(null)
		}
	}, [isLoggedIn])

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault()
		if (isLoggedIn) {
			navigate(to)
		} else {
			setNext(to)
			setActiveModal('login')
		}
	}
	return (
		<NavLink
			to={to}
			onClick={handleClick}
			className={({ isActive }) =>
				`px-2  hover:text-wax-amber ${isActive && 'text-wax-amber'}`
			}
		>
			{title}
		</NavLink>
	)
}

export default NavUserLink
