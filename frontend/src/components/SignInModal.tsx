import React, { useState } from 'react'
import useAuthStore from '../stores/authStore'
import fetchWithAuth from '../utils/fetch'
import useModalStore from '../stores/modalStore'

interface SignInModalProps {
	isOpen: boolean
	onClose: () => void
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
	const { setActiveModal } = useModalStore((state) => state)
	const [loginForm, setLoginForm] = useState({
		credential: '',
		password: '',
	})
	const [errors, setErrors] = useState<{
		fetch?: any
		credential?: string
		password?: string
	}>({})

	const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	const MIN_USERNAME_LENGTH = 4
	const MAX_USERNAME_LENGTH = 30
	const MIN_PASSWORD_LENGTH = 8
	const MAX_PASSWORD_LENGTH = 128

	const handleFormChange =
		(loginFormField: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
			setLoginForm({
				...loginForm,
				[loginFormField]: e.target.value,
			})
		}
	const handleClose = () => {
		setLoginForm({
			credential: '',
			password: '',
		})
		setErrors({})
		onClose()
	}

	const validateForm = () => {
		const newErrors: { credential?: string; password?: string } = {}

		if (!loginForm.credential) {
			newErrors.credential = 'Username or email is required.'
		} else if (EMAIL_REGEX.test(loginForm.credential)) {
		} else if (
			loginForm.credential.length < MIN_USERNAME_LENGTH ||
			loginForm.credential.length > MAX_USERNAME_LENGTH
		) {
			newErrors.credential = `User name must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters`
		}

		if (!loginForm.password) {
			newErrors.password = 'Password is required.'
		} else if (
			loginForm.password.length < MIN_PASSWORD_LENGTH ||
			loginForm.password.length > MAX_PASSWORD_LENGTH
		) {
			newErrors.password = `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.`
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!validateForm()) {
			return
		}
		const url = '/api/login'
		try {
			const res = await fetchWithAuth(url, {
				method: 'POST',
				body: JSON.stringify(loginForm),
			})
			if (!res.ok) {
				const error = await res.json()
				setErrors({ ...errors, fetch: error })
				throw new Error('Login failed')
			}

			const { access_token, token_type, ...remaining } = await res.json()
			useAuthStore.getState().login(remaining, access_token)
			onClose()
		} catch (e) {
			setErrors({ ...errors, fetch: 'Invalid credentials' })
			console.log(e)
		}
	}

	const handleDemoClick = async () => {
		const url = '/api/login'
		try {
			const res = await fetchWithAuth(url, {
				method: 'POST',
				body: JSON.stringify({
					credential: 'admin',
					password: 'password',
				}),
			})
			if (!res.ok) {
				throw new Error('Login failed')
			}
			const { access_token, token_type, ...remaining } = await res.json()
			useAuthStore.getState().login(remaining, access_token)
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
				className="flex flex-col items-center p-8 border-4 rounded shadow-lg bg-wax-silver border-wax-gray"
				onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
			>
				<h2 className="mb-4 text-3xl font-bold border-b-2 text-wax-black border-wax-black">
					Sign In
				</h2>
				{errors.fetch && (
					<div className="text-wax-red text-base font-bold italic mb-2">
						{errors.fetch}
					</div>
				)}
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						onChange={handleFormChange('credential')}
						value={loginForm.credential}
						placeholder="Username or Email"
						className={`block w-full p-2 mb-2 border rounded text-wax-black ${
							errors.credential ? 'border-wax-red' : ''
						}`}
						required
					/>
					{errors.credential && (
						<div className="text-wax-red text-sm font-bold italic mb-2">
							{errors.credential}
						</div>
					)}
					<input
						type="password"
						onChange={handleFormChange('password')}
						value={loginForm.password}
						placeholder="Password"
						className={`block w-full p-2 mb-2 border rounded text-wax-black ${
							errors.password ? 'border-wax-red' : ''
						}`}
						required
					/>
					{errors.password && (
						<div className="text-wax-red font-bold italic text-sm mb-2">
							{errors.password}
						</div>
					)}
					<button
						type="submit"
						className="w-full py-2 border-4 rounded bg-wax-blue text-wax-cream border-wax-silver hover:border-wax-cream hover:ring-2 hover:ring-wax-blue"
					>
						Sign In
					</button>
				</form>
				<div className="flex justify-center">
					<button
						onClick={handleDemoClick}
						className="w-full px-5 py-2 mx-2 mt-3 border-4 rounded bg-wax-amber text-wax-cream border-wax-silver hover:border-wax-cream hover:ring-2 hover: ring-wax-amber"
					>
						Demo
					</button>
					<button
						type="button"
						onClick={handleClose}
						className="w-full px-5 py-2 mx-2 mt-3 border-4 rounded bg-wax-red text-wax-cream border-wax-silver hover:border-wax-cream hover:ring-2 hover:ring-wax-red"
					>
						Close
					</button>
				</div>
				<small className="text-wax-gray text-sm mt-2">
					Don't have an account? Sign up{' '}
					<a
						className="hover:underline text-wax-blue cursor-pointer"
						onClick={() => setActiveModal('signup')}
					>
						here
					</a>
					.
				</small>
			</div>
		</div>
	)
}

export default SignInModal
