import React, { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import { faPlus, faMinus, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import useUserStore from '../stores/userStore'
import { Item } from '../stores/itemStore'
import DropdownMenu from './DropdownMenu'

interface DashboardItemTitleProps {
	itemId: number
}

const DashboardItemTile: React.FC<DashboardItemTitleProps> = ({ itemId }) => {
	const item: Item = useUserStore((state) => state.itemDetails[itemId])
	const removeItem = useUserStore((state) => state.removeItem)

	const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const menuOptions = [{ label: 'Remove', value: 'remove' }]

	const toggleDropdown = () => setDropdownOpen((prev) => !prev)

	const handleOptionSelect = (option: { label: string; value: string }) => {
		switch (option.value) {
			case 'remove':
				removeItem(itemId)
				break
			default:
		}
		setDropdownOpen(false)
	}

	const handleClickOutside = (event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
		) {
			setDropdownOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])
	if (!item) {
		return <div>Item not found</div>
	}
	return (
		<>
			<div
				className={`flex flex-col items-center justify-between w-56 h-64 m-1 rounded border-6 bg-wax-cream border-wax-amber ring-8 ${
					item.listing ? 'ring-green-700' : 'ring-wax-gray'
				}`}
			>
				<div className="flex justify-between w-full h-6 px-1 bg-wax-amber">
					<div className="relative flex space-x-1">
						<FontAwesomeIcon
							icon={faEye}
							size="xl"
							className="cursor-pointer hover:text-wax-cream"
						/>
						{!item.listing && (
							<div className="flex flex-col" ref={dropdownRef}>
								<FontAwesomeIcon
									icon={faMinus}
									size="xl"
									onClick={toggleDropdown}
									className="cursor-pointer hover:text-wax-cream"
								/>
								<DropdownMenu
									className="absolute left-0 w-24 font-bold text-center border border-4 rounded-lg shadow-lg cursor-pointer bg-wax-cream bottom-full border-wax-red hover:bg-wax-red hover:text-wax-cream hover:border-wax-gray"
									options={menuOptions}
									isOpen={isDropdownOpen}
									onSelect={handleOptionSelect}
								/>
							</div>
						)}
					</div>
					<FontAwesomeIcon
						icon={faEllipsis}
						size="xl"
						className="cursor-pointer hover:text-wax-cream"
					/>
				</div>
				<div
					className="flex flex-col justify-between w-full h-56 text-wax-gray "
					style={{
						backgroundImage: "url('/tile-background.png')",
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}
				>
					<div className="w-full font-semibold text-center cursor-default bg-opacity-60 text-wax-black bg-wax-silver">
						{item.album.title}
					</div>
					<div></div>
				</div>
				<div className="flex items-end justify-between w-full h-6 px-2 font-semibold bg-wax-gray text-wax-amber">
					<div className="cursor-pointer">{item.artist.name}</div>
					{item.listing && (
						<div className="cursor-pointer">$ {item.listing.price}</div>
					)}
				</div>
			</div>
		</>
	)
}

export default DashboardItemTile
