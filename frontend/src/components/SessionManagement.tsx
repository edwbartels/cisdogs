import React, { useState } from 'react';
import SessionButton from './SessionButton';
import SignInModal from './SignInModal';
import SignUpModal from './SignUpModal';

// interface ActiveModalState = 'signIn'|'signUp'|null(null)

const SessionManagement: React.FC = () => {
	const [activeModal, setActiveModal] = useState<'signIn' | 'signUp' | null>(
		null
	);

	return (
		<div className="flex">
			<SessionButton
				onClick={() => {
					setActiveModal('signUp');
				}}
				title="Sign Up"
			/>
			<SessionButton
				onClick={() => {
					setActiveModal('signIn');
				}}
				title="Sign In"
			/>

			<SignUpModal
				isOpen={activeModal === 'signUp'}
				onClose={() => setActiveModal(null)}
			/>
			<SignInModal
				isOpen={activeModal === 'signIn'}
				onClose={() => setActiveModal(null)}
			/>
		</div>
	);
};

export default SessionManagement;
