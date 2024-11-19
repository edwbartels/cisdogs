import React from 'react';

interface SessionButtonProps {
	onClick: () => void;
	title: string;
}

const SessionButton: React.FC<SessionButtonProps> = ({ onClick, title }) => {
	return (
		<a
			onClick={onClick}
			className="bg-wax-silver text-wax-black px-4 py-2 mx-1 rounded-md font-medium hover:bg-wax-amber cursor-pointer"
		>
			{title}
		</a>
	);
};

export default SessionButton;
