import React, { useState } from 'react'
import SessionButton from './SessionButton'
import SignInModal from './SignInModal'
import SignUpModal from './SignUpModal'
import useAuthStore from '../stores/authStore'
import fetchWithAuth from '../utils/fetch'

// interface ActiveModalState = 'signIn'|'signUp'|null(null)

const SessionManagement: React.FC = () => {
	const [activeModal, setActiveModal] = useState<'signIn' | 'signUp' | null>(
		null
	)
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
							setActiveModal('signUp')
						}}
						title="Sign Up"
					/>
					<SessionButton
						onClick={() => {
							setActiveModal('signIn')
						}}
						title="Log In"
					/>
				</>
			)}

			<SignUpModal
				isOpen={activeModal === 'signUp'}
				onClose={() => setActiveModal(null)}
			/>
			<SignInModal
				isOpen={activeModal === 'signIn'}
				onClose={() => setActiveModal(null)}
			/>
		</div>
	)
}

export default SessionManagement
