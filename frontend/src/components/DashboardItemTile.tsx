import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import useUserStore from '../stores/userStore'
import { Item } from '../stores/itemStore'
import DropdownMenu from './DropdownMenu'
import EyeIcon from './EyeIcon'

interface DashboardItemTitleProps {
	itemId: number
}

type DropdownOptions = 'remove' | 'extra' | null

const DashboardItemTile: React.FC<DashboardItemTitleProps> = ({ itemId }) => {
	const item: Item = useUserStore((state) => state.itemDetails[itemId])
	const removeItem = useUserStore((state) => state.removeItem)
	const navigate = useNavigate()

	const [activeDropdown, setActiveDropdown] = useState<{
		itemId: number
		type: DropdownOptions
	} | null>(null)

	const menuOptions = [{ label: 'Remove', value: 'remove' }]
	const extraOptions = [
		{ label: 'Item', value: 'item' },
		{ label: 'Release', value: 'release' },
		{ label: 'Album', value: 'album' },
		{ label: 'Artist', value: 'artist' },
	]
	if (item?.listing)
		extraOptions.unshift({ label: 'Listing', value: 'listing' })

	// const toggleDropdown = (drop: DropdownOptions) => setActiveDropdown(drop)

	const handleOptionSelect = (option: { label: string; value: string }) => {
		switch (option.value) {
			case 'remove':
				removeItem(itemId)
				break
			case 'listing':
				navigate(`/listing/${item.listing?.id}`)
				break
			case 'item':
				navigate(`/item/${item.id}`)
				break
			case 'release':
				navigate(`/release/${item.release.id}`)
				break
			case 'album':
				navigate(`/album/${item.album.id}`)
				break
			case 'artist':
				navigate(`/artist/${item.artist.id}`)
				break
			default:
		}
		setActiveDropdown(null)
	}
	const handleOpenDropdown = (itemId: number, type: DropdownOptions) => {
		setActiveDropdown({ itemId, type })
	}

	const handleCloseDropdown = () => {
		setActiveDropdown(null)
	}

	const handleClickOutside = React.useCallback(
		(event: MouseEvent) => {
			if (!(event.target instanceof Element)) {
				return
			}
			const clickInside = event.target.closest('.dropdown')
			if (!clickInside) {
				setActiveDropdown(null)
			}
		},
		[activeDropdown]
	)

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [handleClickOutside])
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
				{' '}
				{`Release ID: ${item.release.id}`}
				<div className="flex justify-between w-full h-6 px-1 bg-wax-amber">
					<div className="relative flex space-x-1">
						<EyeIcon id={item.release.id} />

						{!item.listing && (
							<div className="flex flex-col remove-dropdown">
								<FontAwesomeIcon
									icon={faMinus}
									size="xl"
									onClick={() =>
										activeDropdown?.itemId === itemId &&
										activeDropdown.type === 'remove'
											? handleCloseDropdown()
											: handleOpenDropdown(itemId, 'remove')
									}
									className="cursor-pointer hover:text-wax-cream"
								/>
								<DropdownMenu
									options={menuOptions}
									isOpen={
										activeDropdown?.itemId === itemId &&
										activeDropdown.type === 'remove'
									}
									onSelect={handleOptionSelect}
									className="absolute left-0 w-24 font-bold text-center border border-4 rounded-lg shadow-lg cursor-pointer bg-wax-cream bottom-full border-wax-red hover:bg-wax-red hover:text-wax-cream hover:border-wax-gray"
								/>
							</div>
						)}
					</div>
					<div className="relative flex flex-col extra-dropdown">
						<FontAwesomeIcon
							icon={faEllipsis}
							size="xl"
							onClick={() =>
								activeDropdown?.itemId === itemId &&
								activeDropdown.type === 'extra'
									? handleCloseDropdown()
									: handleOpenDropdown(itemId, 'extra')
							}
							className="cursor-pointer hover:text-wax-cream"
						/>
						<DropdownMenu
							title="View Details"
							options={extraOptions}
							isOpen={
								activeDropdown?.itemId === itemId &&
								activeDropdown.type === 'extra'
							}
							onSelect={handleOptionSelect}
							className="-right-2 bg-wax-cream"
						/>
					</div>
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
