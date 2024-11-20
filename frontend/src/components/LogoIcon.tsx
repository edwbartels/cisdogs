import React, { useState } from 'react'

interface LogoIconProps {
	tw: string
	isActive?: boolean
}

const LogoIcon: React.FC<LogoIconProps> = ({ tw, isActive }) => {
	const [hovered, setHovered] = useState(false)

	return (
		<img
			src={
				isActive || hovered
					? '/wax-exchange-silver-amber.png'
					: '/wax-exchange-cream.png'
			}
			alt="Custom Icon"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			className={tw}
		/>
	)
}

export default LogoIcon
