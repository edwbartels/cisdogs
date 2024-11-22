import React, { useState } from 'react'
import useAuthStore from '../stores/authStore'

interface SignInModalProps {
	isOpen: boolean
	onClose: () => void
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
	const [loginForm, setLoginForm] = useState({
		credential: '',
		password: '',
	})

	const handleFormChange =
		(loginFormField: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
			setLoginForm({
				...loginForm,
				[loginFormField]: e.target.value,
			})
		}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const url = '/api/login'
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(loginForm),
			})
			if (!res.ok) {
				throw new Error('Login failed')
			}

			const { access_token, ...remaining } = await res.json()
			localStorage.setItem('accessToken', access_token)
			useAuthStore.getState().login(remaining)
			onClose()
		} catch (e) {
			console.error(e)
		}
	}

	const handleDemoClick = async () => {
		const url = '/api/login'
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					credential: 'admin',
					password: 'password',
				}),
			})
			if (!res.ok) {
				throw new Error('Login failed')
			}
			const { access_token, ...remaining } = await res.json()
			localStorage.setItem('accessToken', access_token)
			useAuthStore.getState().login(remaining)
			onClose()
		} catch (e) {
			console.error(e)
		}
	}
	if (!isOpen) return null

	return (
		<div
			className="fixed inset-0 z-10 flex items-center justify-center bg-opacity-50 bg-wax-black"
			onClick={onClose} // Close modal on background click
		>
			<div
				className="flex flex-col items-center p-8 border-2 rounded shadow-lg bg-wax-silver border-wax-gray"
				onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
			>
				<h2 className="mb-4 text-xl font-bold border-b-2 text-wax-black border-wax-black">
					Sign In
				</h2>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						onChange={handleFormChange('credential')}
						value={loginForm.credential}
						placeholder="Username or Email"
						className="block w-full p-2 mb-2 border rounded text-wax-black"
						required
					/>
					<input
						type="password"
						onChange={handleFormChange('password')}
						value={loginForm.password}
						placeholder="Password"
						className="block w-full p-2 mb-2 border rounded text-wax-black"
						required
					/>
					<button
						type="submit"
						className="w-full py-2 border-4 rounded bg-wax-blue text-wax-cream border-wax-silver hover:border-wax-blue"
					>
						Sign In
					</button>
				</form>
				<div className="flex justify-center">
					<button
						onClick={handleDemoClick}
						className="w-full px-5 py-2 mx-2 mt-3 border-4 rounded bg-wax-amber text-wax-cream border-wax-silver hover:border-wax-amber"
					>
						Demo
					</button>
					<button
						onClick={onClose}
						className="w-full px-5 py-2 mx-2 mt-3 border-4 rounded bg-wax-red text-wax-cream border-wax-silver hover:border-wax-red"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	)
}

export default SignInModal
