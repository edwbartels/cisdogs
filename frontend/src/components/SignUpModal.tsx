import React, { useState } from 'react'
import useAuthStore from '../stores/authStore'
import fetchWithAuth from '../utils/fetch'

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
	const [errors, setErrors] = useState<{
		fetch?: any
		username?: string
		email?: string
		password?: string
	}>({})

	const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	const MIN_USERNAME_LENGTH = 4
	const MAX_USERNAME_LENGTH = 30
	const MIN_PASSWORD_LENGTH = 8
	const MAX_PASSWORD_LENGTH = 128

	const handleFormChange =
		(signupFormField: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
			setSignupForm({
				...signupForm,
				[signupFormField]: e.target.value,
			})
		}
	const handleClose = () => {
		setSignupForm({
			username: '',
			email: '',
			password: '',
		})
		setErrors({})
		onClose()
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!validateForm()) {
			return
		}
		const url = '/api/signup'
		try {
			const res = await fetchWithAuth(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(signupForm),
			})
			if (!res.ok) {
				const error = await res.json()
				setErrors({ ...errors, fetch: error })
				throw new Error('Login failed')
			}
			const { access_token, user } = await res.json()
			useAuthStore.getState().login(user, access_token)
			onClose()
		} catch (e) {
			setErrors({ ...errors, fetch: 'Invalid credentials' })
			console.error(e)
		}
	}

	const validateForm = () => {
		const newErrors: { username?: string; email?: string; password?: string } =
			{}

		if (!signupForm.username) {
			newErrors.username = 'Username is required.'
		} else if (
			signupForm.username.length < MIN_USERNAME_LENGTH ||
			signupForm.username.length > MAX_USERNAME_LENGTH
		) {
			newErrors.username = `User name must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters`
		}
		if (!signupForm.email) {
			newErrors.email = 'Email is required.'
		} else if (!EMAIL_REGEX.test(signupForm.email)) {
			newErrors.email = 'Invalid email.'
		}

		if (!signupForm.password) {
			newErrors.password = 'Password is required.'
		} else if (
			signupForm.password.length < MIN_PASSWORD_LENGTH ||
			signupForm.password.length > MAX_PASSWORD_LENGTH
		) {
			newErrors.password = `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.`
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}
	if (!isOpen) return null

	return (
		<div
			className="fixed inset-0 z-10 flex items-center justify-center bg-opacity-50 bg-wax-black"
			onClick={onClose}
		>
			<div
				className="flex flex-col items-center p-8 border-4 rounded shadow-lg bg-wax-silver border-wax-gray"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className="mb-4 text-3xl font-bold border-b-2 text-wax-black border-wax-black">
					Sign Up
				</h2>
				{errors.fetch && (
					<div className="text-wax-red text-base font-bold italic mb-2">
						{errors.fetch}
					</div>
				)}
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						onChange={handleFormChange('username')}
						defaultValue={signupForm.username}
						placeholder="Username"
						className={`block w-full p-2 mb-2 border rounded text-wax-black ${
							errors.username ? 'border-wax-red' : ''
						}`}
						required
					/>
					{errors.username && (
						<div className="text-wax-red text-sm font-bold italic mb-2">
							{errors.username}
						</div>
					)}
					<input
						type="email"
						onChange={handleFormChange('email')}
						defaultValue={signupForm.email}
						placeholder="Email"
						className={`block w-full p-2 mb-2 border rounded text-wax-black text-wax-black ${
							errors.email ? 'border-wax-red' : ''
						}`}
						required
					/>
					{errors.email && (
						<div className="text-wax-red text-sm font-bold italic mb-2">
							{errors.email}
						</div>
					)}
					<input
						type="password"
						onChange={handleFormChange('password')}
						defaultValue={signupForm.password}
						placeholder="Password"
						className={`block w-full p-2 mb-2 border rounded text-wax-blacktext-wax-black ${
							errors.password ? 'border-wax-red' : ''
						}`}
					/>
					{errors.password && (
						<div className="text-wax-red text-sm font-bold italic mb-2">
							{errors.password}
						</div>
					)}
					<button
						type="submit"
						className="w-full py-2 border-4 rounded border-wax-silver bg-wax-teal text-wax-cream hover:border-wax-teal"
					>
						Sign Up
					</button>
				</form>
				<button
					onClick={handleClose}
					className="w-1/2 px-4 py-2 mt-4 text-white border-4 rounded border-wax-silver bg-wax-red hover:border-wax-red"
				>
					Close
				</button>
			</div>
		</div>
	)
}

export default SignUpModal
