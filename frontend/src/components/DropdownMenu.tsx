import React from 'react'

interface DropdownMenuProps {
	options: { label: string; value: string }[]
	onSelect: (option: { label: string; value: string }) => void
	isOpen: boolean
	className?: string
}
const DropdownMenu: React.FC<DropdownMenuProps> = ({
	options,
	onSelect,
	isOpen,
	className,
}) => {
	if (!isOpen) return null

	return (
		<div className={`${className}`}>
			{options.map((option, index) => (
				<div key={index} onClick={() => onSelect(option)}>
					{option.label}
				</div>
			))}
		</div>
	)
}

export default DropdownMenu
