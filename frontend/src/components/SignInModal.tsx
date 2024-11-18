import React, { useState } from 'react';

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
		const url = '/api/auth';
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(loginForm),
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
			onClick={onClose} // Close modal on background click
		>
			<div
				className="bg-white p-6 rounded shadow-lg flex flex-col items-center"
				onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
			>
				<h2 className="text-xl text-black border-black border-b-2 font-bold mb-4">
					Sign In
				</h2>
				<form>
					<input
						type="text"
						onChange={handleFormChange('credential')}
						defaultValue={loginForm.credential}
						placeholder="Username or Email"
						className="block text-black w-full mb-2 p-2 border rounded"
						required
					/>
					<input
						type="password"
						onChange={handleFormChange('password')}
						defaultValue={loginForm.password}
						placeholder="Password"
						className="block text-black w-full mb-2 p-2 border rounded"
						required
					/>
					<button
						type="submit"
						onClick={() => handleSubmit}
						className="w-full bg-blue-500 text-white py-2 rounded"
					>
						Sign In
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

export default SignInModal;
