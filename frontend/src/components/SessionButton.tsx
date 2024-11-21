import React from 'react'

interface SessionButtonProps {
	onClick: () => void
	title: string
}

const SessionButton: React.FC<SessionButtonProps> = ({ onClick, title }) => {
	return (
		<a
			onClick={onClick}
			className="px-4 py-1 mx-1 font-medium border-2 rounded-md cursor-pointer bg-wax-silver text-wax-black hover:bg-wax-amber border-wax-gray hover:border-wax-amber"
		>
			{title}
		</a>
	)
}

export default SessionButton
