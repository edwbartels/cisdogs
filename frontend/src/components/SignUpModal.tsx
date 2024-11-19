import React, { useState } from 'react';
import useAuthStore from '../stores/authStore';

interface SignUpModalProps {
	isOpen: boolean;
	onClose: () => void;
}
const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
	const [signupForm, setSignupForm] = useState({
		username: '',
		email: '',
		password: '',
	});

	const handleFormChange =
		(signupFormField: string) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSignupForm({
				...signupForm,
				[signupFormField]: e.target.value,
			});
		};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const url = '/api/signup';
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(signupForm),
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
			onClick={onClose}
		>
			<div
				className="bg-wax-cream p-8 rounded shadow-lg flex flex-col items-center border-2 border-wax-gray"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className="text-xl text-wax-black border-wax-black border-b-2 font-bold mb-4">
					Sign Up
				</h2>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						onChange={handleFormChange('username')}
						defaultValue={signupForm.username}
						placeholder="Username"
						className="block text-wax-black w-full mb-2 p-2 border rounded"
						required
					/>
					<input
						type="email"
						onChange={handleFormChange('email')}
						defaultValue={signupForm.email}
						placeholder="Email"
						className="block text-wax-black w-full mb-2 p-2 border rounded"
						required
					/>
					<input
						type="password"
						onChange={handleFormChange('password')}
						defaultValue={signupForm.password}
						placeholder="Password"
						className="text-wax-black block w-full mb-2 p-2 border rounded"
					/>
					<button
						type="submit"
						className="w-full bg-wax-teal text-wax-cream py-2 rounded hover:border-wax-teal border-4"
					>
						Sign Up
					</button>
				</form>
				<button
					onClick={onClose}
					className="mt-4 bg-wax-red text-white px-4 py-2 rounded w-1/2 hover:border-wax-red border-2"
				>
					Close
				</button>
			</div>
		</div>
	);
};

export default SignUpModal;
