import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import { faPlus, faMinus, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import useUserStore from '../stores/userStore'
import useWatchlistStore from '../stores/watchlistStore'
import { Listing } from '../stores/listingStore'
import DropdownMenu from './DropdownMenu'
import EyeIcon from './EyeIcon'

interface WatchlistListingTileProps {
	listingId: number
}
type DropdownOptions = 'remove' | 'extra' | null

const WatchlistListingTile: React.FC<WatchlistListingTileProps> = ({
	listingId,
}) => {
	const listing: Listing = useWatchlistStore(
		(state) => state.listingDetails[listingId]
	)
	// const removeListing = useUserStore((state) => state.removeListing)
	const navigate = useNavigate()
	const [activeDropdown, setActiveDropdown] = useState<DropdownOptions>(null)
	// const menuOptions = [{ label: 'Remove', value: 'remove' }]
	const extraOptions = [
		{ label: 'Listing', value: 'listing' },
		{ label: 'Item', value: 'item' },
		{ label: 'Release', value: 'release' },
		{ label: 'Album', value: 'album' },
		{ label: 'Artist', value: 'artist' },
	]

	const handleOptionSelect = (option: { label: string; value: string }) => {
		switch (option.value) {
			// case 'remove':
			// 	removeListing(listingId)
			// 	break
			case 'listing':
				navigate(`/listing/${listing.id}`)
				break
			case 'item':
				navigate(`/item/${listing.id}`)
				break
			case 'release':
				navigate(`/release/${listing.release.id}`)
				break
			case 'album':
				navigate(`/album/${listing.album.id}`)
				break
			case 'artist':
				navigate(`/artist/${listing.artist.id}`)
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

	if (!listing) {
		return <div>Listing not found</div>
	}
	return (
		<>
			<div className="flex flex-col items-center justify-between w-56 h-64 m-1 rounded border-6 bg-wax-cream border-wax-amber ring-8 ring-wax-gray ">
				{`Release ID: ${listing.release.id}`}
				<div className="flex justify-between w-full h-6 px-1 bg-wax-amber">
					<div className="relative flex space-x-1">
						<EyeIcon id={listing.release.id} />
						{/* <div className="flex flex-col remove-dropdown">
							<FontAwesomeIcon
								icon={faMinus}
								size="xl"
								onClick={() => setActiveDropdown('remove')}
								className="cursor-pointer hover:text-wax-cream"
							/>
							<DropdownMenu
								className="absolute left-0 w-24 font-bold text-center border border-4 rounded-lg shadow-lg cursor-pointer bg-wax-cream bottom-full border-wax-red hover:bg-wax-red hover:text-wax-cream hover:border-wax-gray"
								options={menuOptions}
								isOpen={activeDropdown == 'remove'}
								onSelect={handleOptionSelect}
							/>
						</div> */}
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

export default WatchlistListingTile
