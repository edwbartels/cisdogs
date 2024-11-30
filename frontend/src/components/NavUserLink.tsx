import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import useModalStore from '../stores/modalStore'
import SignInModal from './SignInModal'

interface NavUserLinkProps {
	title: string
	to: string
}

const NavUserLink: React.FC<NavUserLinkProps> = ({ title, to }) => {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
	const navigate = useNavigate()
	const { activeModal, setActiveModal, next, setNext } = useModalStore(
		(state) => state
	)
	useEffect(() => {
		if (next) {
			navigate(next)
		}
		return () => {
			setNext(null)
		}
	}, [isLoggedIn])

	const handleClose = () => {
		setActiveModal(null)
	}

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
		<>
			<a href={to} onClick={handleClick} className="px-2  hover:text-wax-amber">
				{title}
			</a>
			<SignInModal isOpen={activeModal === 'login'} onClose={handleClose} />
		</>
	)
}

export default NavUserLink
