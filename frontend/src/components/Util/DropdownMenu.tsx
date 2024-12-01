import React from 'react'
import { twMerge } from 'tailwind-merge'

interface DropdownOption {
	label: string
	value: string
}
interface DropdownMenuProps {
	options: DropdownOption[]
	onSelect: (option: DropdownOption) => void
	title?: string
	isOpen: boolean
	className?: string
}
const DropdownMenu: React.FC<DropdownMenuProps> = ({
	options,
	onSelect,
	title,
	isOpen,
	className,
}) => {
	if (!isOpen) return null

	return (
		<div
			className={twMerge(
				'absolute w-auto min-w-max cursor-default bg-wax-cream border-2 border-wax-gray rounded-lg shadow-md z-10 hover:ring-wax-blue hover:ring-1 pointer-events-none dropdown',
				className
			)}
		>
			{title && (
				<div className="px-2 font-bold bg-wax-blue rounded-t-md text-wax-cream">
					{title}
				</div>
			)}
			<ul>
				{options.map((option) => (
					<li
						key={option.value}
						className="px-1 hover:bg-wax-blue rounded-sm  cursor-pointer hover:bg-opacity-35 pointer-events-auto"
						onClick={() => onSelect(option)}
					>
						{option.label}
					</li>
				))}
			</ul>
		</div>
	)
}

export default DropdownMenu
