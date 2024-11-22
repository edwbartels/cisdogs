import React, { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import { faPlus, faMinus, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import useUserStore from '../stores/userStore'
import { Listing } from '../stores/listingStore'
import DropdownMenu from './DropdownMenu'

interface DashboardListingTitleProps {
	listingId: number
}

const DashboardListingTile: React.FC<DashboardListingTitleProps> = ({
	listingId,
}) => {
	const listing: Listing = useUserStore(
		(state) => state.listingDetails[listingId]
	)
	const removeListing = useUserStore((state) => state.removeListing)

	const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const menuOptions = [{ label: 'Remove', value: 'remove' }]

	const toggleDropdown = () => setDropdownOpen((prev) => !prev)

	const handleOptionSelect = (option: { label: string; value: string }) => {
		switch (option.value) {
			case 'remove':
				removeListing(listingId)
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

	if (!listing) {
		return <div>Listing not found</div>
	}
	return (
		<>
			<div className="flex flex-col items-center justify-between w-56 h-64 m-1 rounded border-6 bg-wax-cream border-wax-amber ring-8 ring-wax-gray ">
				<div className="flex justify-between w-full h-6 px-1 bg-wax-amber">
					<div className="relative flex space-x-1">
						<FontAwesomeIcon
							icon={faEye}
							size="xl"
							className="cursor-pointer hover:text-wax-cream"
						/>
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
					<div className="w-full font-semibold text-center bg-opacity-60 text-wax-black bg-wax-silver">
						{listing.album.title}
					</div>
					<div></div>
				</div>
				<div className="flex items-end justify-between w-full h-6 px-2 font-semibold bg-wax-gray text-wax-amber">
					<div className="cursor-pointer">{listing.artist.name}</div>
					<div className="cursor-pointer">$ {listing.price}</div>
				</div>
			</div>
		</>
	)
}

export default DashboardListingTile
