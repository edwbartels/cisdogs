import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useItemStore, { Item } from '../../stores/itemStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEllipsis, faUser } from '@fortawesome/free-solid-svg-icons'
import useUserStore from '../../stores/userStore'
import useAuthStore from '../../stores/authStore'
import DropdownMenu from '../Util/DropdownMenu'
import EyeIcon from '../Icons/EyeIcon'
import { capitalizeFirst } from '../../utils/capitalize'

interface ItemTileMainProps {
	itemId: number
}
type DropdownOptions = 'add' | 'extra' | 'user' | null

const ItemTileMain: React.FC<ItemTileMainProps> = ({ itemId }) => {
	const userId = useAuthStore((state) => state.user?.id)
	const item: Item = useItemStore((state) => state.items[itemId])
	const { collection, addToCollection } = useUserStore((state) => state)
	const navigate = useNavigate()

	const [activeDropdown, setActiveDropdown] = useState<DropdownOptions>(null)
	const menuOptions = [{ label: 'Add to Collection', value: 'add' }]
	const extraOptions = [
		{ label: 'Item', value: 'item' },
		{ label: 'Release', value: 'release' },
		{ label: 'Album', value: 'album' },
		{ label: 'Artist', value: 'artist' },
	]
	const userOptions = [{ label: 'Profile', value: 'profile' }]

	if (item?.listing)
		extraOptions.unshift({ label: 'Listing', value: 'listing' })

	const handleOptionSelect = (option: { label: string; value: string }) => {
		switch (option.value) {
			case 'profile':
				navigate(`/profile/${item.owner.id}`)
				break
			case 'add':
				userId &&
					addToCollection({
						release_id: item.release.id,
						owner_id: userId,
					})
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
	const handleClickOutside = React.useCallback(
		(event: MouseEvent) => {
			if (!(event.target instanceof Element)) {
				return
			}
			const targetElement = event.target as Element

			const clickedAdd = targetElement.closest('.add-dropdown')
			const clickedExtra = targetElement.closest('.extra-dropdown')
			const clickedUser = targetElement.closest('.user-dropdown')

			if (!clickedAdd && activeDropdown === 'add') setActiveDropdown(null)
			if (!clickedExtra && activeDropdown === 'extra') setActiveDropdown(null)
			if (!clickedUser && activeDropdown === 'user') setActiveDropdown(null)
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
		<div
			className={`tile-container ${
				item.listing ? 'ring-green-700' : 'ring-wax-gray'
			} `}
		>
			<div className="tile-title-bar">
				<div className="relative flex space-x-1">
					<EyeIcon id={item.release.id} />
					{!collection.has(item.release.id) && (
						<div className="flex flex-col add-dropdown">
							<FontAwesomeIcon
								icon={faPlus}
								size="xl"
								className="cursor-pointer hover:text-wax-cream"
								onClick={() => userId && setActiveDropdown('add')}
							/>
							<DropdownMenu
								className="absolute left-0 w-24 font-bold text-center border border-4 rounded-lg shadow-lg cursor-pointer bg-wax-cream bottom-full border-wax-red hover:bg-wax-red hover:text-wax-cream hover:border-wax-gray"
								options={menuOptions}
								isOpen={activeDropdown === 'add'}
								onSelect={handleOptionSelect}
							/>
						</div>
					)}
				</div>
				<div className="flex space-x-1">
					<div className="relative flex flex-col user-dropdown self-center">
						<FontAwesomeIcon
							icon={faUser}
							size="lg"
							onClick={() => setActiveDropdown('user')}
							className="cursor-pointer hover:text-wax-cream"
						/>
						<DropdownMenu
							title={item.owner.username}
							options={userOptions}
							isOpen={activeDropdown == 'user'}
							onSelect={handleOptionSelect}
							className="bottom-full right-2 bg-wax-cream w-20 font-bold"
						/>
					</div>
					<div className="relative flex flex-col extra-dropdown">
						<FontAwesomeIcon
							icon={faEllipsis}
							size="xl"
							className="cursor-pointer hover:text-wax-cream"
							onClick={() => setActiveDropdown('extra')}
						/>
						<DropdownMenu
							title="View Details"
							options={extraOptions}
							isOpen={activeDropdown == 'extra'}
							onSelect={handleOptionSelect}
							className="-right-2 bg-wax-cream"
						/>
					</div>
				</div>
			</div>
			<div
				className="tile-art-container relative group"
				style={{
					backgroundImage: item.album.art
						? `url(${item.album.art})`
						: "url('/tile-background.png')",
					backgroundSize: 'contain',
					backgroundPosition: 'center',
				}}
				onClick={() => navigate(`/release/${item.release.id}`)}
			>
				{item.listing && (
					<div
						className="absolute z-10 
								invisible group-hover:visible
								bg-wax-gray text-wax-cream text-sm rounded py-1 px-2 absolute bottom-full left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					>{`$${item.listing.price.toFixed(2)}`}</div>
				)}
				<div className="tile-art-title-bar">{item.album.title}</div>
				<div></div>
			</div>

			<div className="tile-footer-2">
				<div
					className="cursor-pointer self-center hover:text-wax-cream"
					onClick={() => navigate(`/artist/${item.artist.id}`)}
				>
					{item.artist.name}
				</div>
				<div
					className="truncate self-center cursor-pointer hover:text-wax-cream"
					onClick={() => navigate(`/release/${item.release.id}`)}
				>
					{`${item.release.media_type.toUpperCase()}`}{' '}
					{item.release.media_type == 'vinyl' &&
						` | ${capitalizeFirst(item.release.variant)}`}
				</div>
			</div>
		</div>
	)
}

export default ItemTileMain
