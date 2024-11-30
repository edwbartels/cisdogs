import React, { useState } from 'react'
import SessionButton from './SessionButton'
import SignInModal from './SignInModal'
import SignUpModal from './SignUpModal'
import useAuthStore from '../stores/authStore'
import fetchWithAuth from '../utils/fetch'
import useModalStore from '../stores/modalStore'

const SessionManagement: React.FC = () => {
	const { activeModal, setActiveModal } = useModalStore((state) => state)
	const { isLoggedIn, logout } = useAuthStore()

	const handleLogout: () => void = async () => {
		try {
			const url = '/api/logout'
			await fetchWithAuth(url, { method: 'POST' })
			logout()
		} catch (err) {
			console.error('Logout failed', err)
		}
	}

	return (
		<div className="flex">
			{isLoggedIn ? (
				<SessionButton onClick={handleLogout} title="Log Out" />
			) : (
				<>
					<SessionButton
						onClick={() => {
							setActiveModal('signup')
						}}
						title="Sign Up"
					/>
					<SessionButton
						onClick={() => {
							setActiveModal('login')
						}}
						title="Log In"
					/>
				</>
			)}

			<SignUpModal
				isOpen={activeModal === 'signup'}
				onClose={() => setActiveModal(null)}
			/>
			<SignInModal
				isOpen={activeModal === 'login'}
				onClose={() => setActiveModal(null)}
			/>
		</div>
	)
}

export default SessionManagement
