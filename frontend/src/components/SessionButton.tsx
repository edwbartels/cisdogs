import React from 'react';

interface SessionButtonProps {
	onClick: () => void;
	title: string;
}

const SessionButton: React.FC<SessionButtonProps> = ({ onClick, title }) => {
	return (
		<a
			onClick={onClick}
			className="bg-white text-blue-600 px-4 py-2 mx-1 rounded-md font-medium hover:bg-gray-100 cursor-pointer"
		>
			{title}
		</a>
	);
};

export default SessionButton;
