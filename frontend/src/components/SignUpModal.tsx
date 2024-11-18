import React, { useState } from 'react';

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
			if (res.ok) {
				const userInfo = await res.json();
				return userInfo;
			}
		} catch (e) {
			return e;
		}
	};
	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
			onClick={onClose}
		>
			<div
				className="bg-white p-6 rounded shadow-lg flex flex-col items-center"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className="text-xl text-black border-black border-b-2 font-bold mb-4">
					Sign Up
				</h2>
				<form>
					<input
						type="text"
						onChange={handleFormChange('username')}
						defaultValue={signupForm.username}
						placeholder="Username"
						className="block text-black w-full mb-2 p-2 border rounded"
						required
					/>
					<input
						type="email"
						onChange={handleFormChange('email')}
						defaultValue={signupForm.email}
						placeholder="Email"
						className="block text-black w-full mb-2 p-2 border rounded"
						required
					/>
					<input
						type="password"
						onChange={handleFormChange('password')}
						defaultValue={signupForm.password}
						placeholder="Password"
						className="block w-full mb-2 p-2 border rounded"
					/>
					<button
						type="submit"
						onClick={() => handleSubmit}
						className="w-full bg-green-500 text-white py-2 rounded"
					>
						Sign Up
					</button>
				</form>
				<button
					onClick={onClose}
					className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-1/2"
				>
					Close
				</button>
			</div>
		</div>
	);
};

export default SignUpModal;
