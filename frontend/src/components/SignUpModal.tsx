import React, { useState } from 'react'
import useAuthStore from '../stores/authStore'

interface SignUpModalProps {
	isOpen: boolean
	onClose: () => void
}
const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
	const [signupForm, setSignupForm] = useState({
		username: '',
		email: '',
		password: '',
	})

	const handleFormChange =
		(signupFormField: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
			setSignupForm({
				...signupForm,
				[signupFormField]: e.target.value,
			})
		}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const url = '/api/signup'
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(signupForm),
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
			className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-wax-black"
			onClick={onClose}
		>
			<div
				className="flex flex-col items-center p-8 border-4 rounded shadow-lg bg-wax-silver border-wax-gray"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className="mb-4 text-3xl font-bold border-b-2 text-wax-black border-wax-black">
					Sign Up
				</h2>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						onChange={handleFormChange('username')}
						defaultValue={signupForm.username}
						placeholder="Username"
						className="block w-full p-2 mb-2 border rounded text-wax-black"
						required
					/>
					<input
						type="email"
						onChange={handleFormChange('email')}
						defaultValue={signupForm.email}
						placeholder="Email"
						className="block w-full p-2 mb-2 border rounded text-wax-black"
						required
					/>
					<input
						type="password"
						onChange={handleFormChange('password')}
						defaultValue={signupForm.password}
						placeholder="Password"
						className="block w-full p-2 mb-2 border rounded text-wax-black"
					/>
					<button
						type="submit"
						className="w-full py-2 border-4 rounded border-wax-silver bg-wax-teal text-wax-cream hover:border-wax-teal"
					>
						Sign Up
					</button>
				</form>
				<button
					onClick={onClose}
					className="w-1/2 px-4 py-2 mt-4 text-white border-4 rounded border-wax-silver bg-wax-red hover:border-wax-red"
				>
					Close
				</button>
			</div>
		</div>
	)
}

export default SignUpModal
