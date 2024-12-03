import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import useWatchlistStore from '../../stores/watchlistStore'
import { Listing } from '../../stores/listingStore'
import DropdownMenu from '../Util/DropdownMenu'
import EyeIcon from '../Icons/EyeIcon'
import { capitalizeFirst } from '../../utils/capitalize'

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
	const navigate = useNavigate()
	const [activeDropdown, setActiveDropdown] = useState<DropdownOptions>(null)
	const extraOptions = [
		{ label: 'Listing', value: 'listing' },
		{ label: 'Item', value: 'item' },
		{ label: 'Release', value: 'release' },
		{ label: 'Album', value: 'album' },
		{ label: 'Artist', value: 'artist' },
	]

	const handleOptionSelect = (option: { label: string; value: string }) => {
		switch (option.value) {
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
			<div className="tile-container ring-wax-gray">
				<div className="tile-title-bar">
					<div className="relative flex space-x-1">
						<EyeIcon id={listing.release.id} />
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
					className="tile-art-container"
					style={{
						backgroundImage: listing.album.art
							? `url(${listing.album.art})`
							: `url('/tile-background.png')`,
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}
					onClick={() => navigate(`/listing/${listing.id}`)}
				>
					<div className="tile-art-title-bar">{listing.album.title}</div>
					<div></div>
				</div>
				<div className="tile-footer-2">
					<div
						className="cursor-pointer self-center hover:text-wax-cream"
						onClick={() => navigate(`/artist/${listing.artist.id}`)}
					>
						{listing.artist.name}
					</div>
					<div className="flex justify-between cursor-pointer ">
						<div
							className="truncate hover:text-wax-cream"
							onClick={() => navigate(`/release/${listing.release.id}`)}
						>
							{`${listing.release.media_type.toUpperCase()}`}{' '}
							{listing.release.media_type == 'vinyl' &&
								` | ${capitalizeFirst(listing.release.variant)}`}
						</div>
						<div
							className="cursor-pointer hover:text-wax-cream"
							onClick={() => navigate(`/listing/${listing.id}`)}
						>
							${listing.price.toFixed(2)}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default WatchlistListingTile
