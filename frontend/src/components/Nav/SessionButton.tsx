import React from 'react'

interface SessionButtonProps {
	onClick: () => void
	title: string
}

const SessionButton: React.FC<SessionButtonProps> = ({ onClick, title }) => {
	return (
		<a
			onClick={onClick}
			className="h-8 px-1 py-1 my-1 text-base font-bold text-center border-2 rounded-md cursor-pointer w-24 bg-wax-silver text-wax-black hover:bg-wax-amber border-wax-gray hover:border-wax-amber dark:hover:bg-waxDark-amber dark:border-waxDark-black"
		>
			{title}
		</a>
	)
}

export default SessionButton
