import React, { useState } from 'react';
import useAuthStore from '../stores/authStore';

interface SignInModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
	const [loginForm, setLoginForm] = useState({
		credential: '',
		password: '',
	});

	const handleFormChange =
		(loginFormField: string) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setLoginForm({
				...loginForm,
				[loginFormField]: e.target.value,
			});
		};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const url = '/api/login';
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(loginForm),
			});
			if (!res.ok) {
				throw new Error('Login failed');
			}

			const { access_token, ...remaining } = await res.json();
			localStorage.setItem('accessToken', access_token);
			useAuthStore.getState().login(remaining);
			onClose();
		} catch (e) {
			console.error(e);
		}
	};

	const handleDemoClick = async () => {
		const url = '/api/login';
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					credential: 'admin',
					password: 'password',
				}),
			});
			if (!res.ok) {
				throw new Error('Login failed');
			}
			const { access_token, ...remaining } = await res.json();
			localStorage.setItem('accessToken', access_token);
			useAuthStore.getState().login(remaining);
			onClose();
		} catch (e) {
			console.error(e);
		}
	};
	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-wax-black bg-opacity-50 flex justify-center items-center"
			onClick={onClose} // Close modal on background click
		>
			<div
				className="bg-wax-cream p-8 rounded shadow-lg flex flex-col items-center border-2 border-wax-gray"
				onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
			>
				<h2 className="text-xl text-wax-black border-wax-black border-b-2 font-bold mb-4">
					Sign In
				</h2>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						onChange={handleFormChange('credential')}
						value={loginForm.credential}
						placeholder="Username or Email"
						className="block text-wax-black w-full mb-2 p-2 border rounded"
						required
					/>
					<input
						type="password"
						onChange={handleFormChange('password')}
						value={loginForm.password}
						placeholder="Password"
						className="block text-wax-black w-full mb-2 p-2 border rounded"
						required
					/>
					<button
						type="submit"
						className="w-full bg-wax-blue text-wax-cream py-2 rounded hover:border-wax-blue border-4"
					>
						Sign In
					</button>
				</form>
				<div className="flex">
					<button
						onClick={handleDemoClick}
						className="mt-3 mx-2 bg-wax-teal text-wax-cream px-5 py-2 rounded w-full hover:border-wax-teal border-2"
					>
						Demo
					</button>
					<button
						onClick={onClose}
						className="mt-3 mx-2 bg-wax-red text-wax-cream px-5 py-2 rounded w-full hover:border-wax-red border-2"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default SignInModal;
