import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { Item } from '../../stores/itemStore'
import DropdownMenu from '../Util/DropdownMenu'
import EyeIcon from '../Icons/EyeIcon'
import { capitalizeFirst } from '../../utils/capitalize'
import useProfileStore from '../../stores/profileStore'

interface ProfileItemTitleProps {
	itemId: number
}

type DropdownOptions = 'remove' | 'extra' | null

const ProfileItemTile: React.FC<ProfileItemTitleProps> = ({ itemId }) => {
	const item: Item = useProfileStore((state) => state.items.items[itemId])
	const navigate = useNavigate()

	const [activeDropdown, setActiveDropdown] = useState<{
		itemId: number
		type: DropdownOptions
	} | null>(null)

	const extraOptions = [
		{ label: 'Item', value: 'item' },
		{ label: 'Release', value: 'release' },
		{ label: 'Album', value: 'album' },
		{ label: 'Artist', value: 'artist' },
	]
	if (item?.listing)
		extraOptions.unshift({ label: 'Listing', value: 'listing' })

	const handleOptionSelect = (option: { label: string; value: string }) => {
		switch (option.value) {
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
				className={`tile-container ${
					item.listing
						? 'ring-wax-green dark:ring-waxDark-green'
						: 'ring-wax-gray dark:ring-waxDark-black'
				}`}
			>
				{' '}
				<div className="tile-title-bar">
					<div className="relative flex space-x-1">
						<EyeIcon id={item.release.id} />
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
					className="tile-art-container relative group"
					style={{
						backgroundImage: item.album.art
							? `url(${item.album.art})`
							: `url('/tile-background.png')`,
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}
					onClick={() => navigate(`/item/${item.id}`)}
				>
					{item.listing && (
						<div
							className="absolute z-10 
								invisible group-hover:visible bg-wax-gray text-wax-cream text-sm rounded py-1 px-2 absolute bottom-full left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
						>{`$${item.listing.price.toFixed(2)}`}</div>
					)}
					<div className="tile-art-title-bar truncate">{item.artist.name}</div>
					<div></div>
				</div>
				<div className="tile-footer-2">
					<div
						className="cursor-pointer truncate text-center hover:text-wax-cream"
						onClick={() => navigate(`/album/${item.album.id}`)}
					>
						{item.album.title}
					</div>
					<div className="flex justify-center cursor-pointer ">
						<div
							className="truncate hover:text-wax-cream"
							onClick={() => navigate(`/release/${item.release.id}`)}
						>
							{`${item.release.media_type.toUpperCase()}`}{' '}
							{item.release.media_type == 'vinyl' &&
								` | ${capitalizeFirst(item.release.variant)}`}
						</div>
						{item.listing && (
							<div className="cursor-pointer hover:text-wax-cream">
								{`${item.listing.price.toFixed(2)}`}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default ProfileItemTile
