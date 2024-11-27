import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import SignInModal from './SignInModal'

interface NavUserLinkProps {
	title: string
	to: string
}

const NavUserLink: React.FC<NavUserLinkProps> = ({ title, to }) => {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
	const navigate = useNavigate()
	const [activeModal, setActiveModal] = useState<'signIn' | null>(null)

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault()
		if (isLoggedIn) {
			navigate(to)
		} else {
			setActiveModal('signIn')
		}
	}
	return (
		<>
			<a href={to} onClick={handleClick} className="px-2  hover:text-wax-amber">
				{title}
			</a>
			<SignInModal
				isOpen={activeModal === 'signIn'}
				onClose={() => setActiveModal(null)}
			/>
		</>
	)
}

export default NavUserLink
