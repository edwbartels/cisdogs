import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useItemStore, { Item } from '../stores/itemStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import useUserStore from '../stores/userStore'
import useAuthStore from '../stores/authStore'
import DropdownMenu from './DropdownMenu'
import EyeIcon from './EyeIcon'

interface ItemTileMainProps {
	itemId: number
}
type DropdownOptions = 'remove' | 'extra' | null

const ItemTileMain: React.FC<ItemTileMainProps> = ({ itemId }) => {
	const userId = useAuthStore((state) => state.user?.id)
	const item: Item = useItemStore((state) => state.items[itemId])
	const { collection, addToCollection } = useUserStore((state) => state)
	const navigate = useNavigate()

	const [activeDropdown, setActiveDropdown] = useState<DropdownOptions>(null)
	const extraOptions = [
		{ label: 'Item', value: 'item' },
		{ label: 'Release', value: 'release' },
		{ label: 'Album', value: 'album' },
		{ label: 'Artist', value: 'artist' },
	]
	const handleOptionSelect = (option: { label: string; value: string }) => {
		switch (option.value) {
			// case 'remove':
			// 	removeItem(itemId)
			// 	break
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

			const clickedRemove = targetElement.closest('.remove-dropdown')
			const clickedExtra = targetElement.closest('.extra-dropdown')

			if (!clickedRemove && activeDropdown === 'remove') setActiveDropdown(null)
			if (!clickedExtra && activeDropdown === 'extra') setActiveDropdown(null)
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
			<div className="flex flex-col items-center justify-between w-56 h-64 m-1 rounded border-6 bg-wax-cream border-wax-amber ring-8 ring-wax-gray ">
				{`Release ID: ${item.release.id}`}
				<div className="flex justify-between w-full h-6 px-1 bg-wax-amber">
					<div className="space-x-1">
						<EyeIcon id={item.release.id} />
						{!collection.has(item.release.id) && (
							<FontAwesomeIcon
								icon={faPlus}
								size="xl"
								className="cursor-pointer hover:text-wax-cream"
								onClick={() =>
									userId &&
									addToCollection({
										release_id: item.release.id,
										owner_id: userId,
									})
								}
							/>
						)}
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
				<div
					className="flex flex-col justify-between w-full h-56 text-wax-gray "
					style={{
						backgroundImage: "url('/tile-background.png')",
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}
				>
					{/* {listing.album.art && <img src=`${listing.album.art}` className='object-contain w-full aspect-square'} */}

					<div className="w-full font-semibold text-center bg-opacity-60 text-wax-black bg-wax-silver">
						{item.album.title}
					</div>
					<div></div>
				</div>
				{/* <div className="w-full h-8 bg-wax-gray text-wax-amber"> */}
				<div className="flex items-end justify-between w-full h-6 px-2 font-semibold bg-wax-gray text-wax-amber">
					{/* <div className="cursor-pointer">{`$${listing.price}`}</div> */}
					<div className="cursor-pointer">{item.artist.name}</div>
					{/* </div> */}
				</div>
			</div>
		</>
	)
}

export default ItemTileMain
